import React from "react";
import { notFound } from "next/navigation";
import Head from "next/head";
import { getHTMLFromGoogleDocId } from "../../lib/googledoc";
import {
  getPageMetadata,
  absoluteUrl,
  imageType,
  loadCustomCSS,
  getHostConfig,
  isGoogleDocId,
} from "../../lib/lib";
import Outline from "../../components/Outline";
import Footer from "../../components/Footer";
import ErrorInvalidDocId from "../../components/ErrorInvalidDocId";
import RenderGoogleDoc from "../../components/RenderGoogleDoc";
import FullPageIframe from "../../components/FullPageIframe";
import hosts from "../../hosts.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export async function getStaticPaths() {
  const paths = [];
  const promises = [];
  if (process.env.NODE_ENV === "development") {
    return { paths: [], fallback: true };
  }
  Object.keys(hosts).forEach((primaryHostname) => {
    if (!hosts[primaryHostname].prerender) return;
    hosts[primaryHostname].hosts.forEach((hostname) => {
      if (hostname.match(/\.local$/)) return; // do not prerender for local environment
      paths.push({
        params: {
          host: hostname,
          path: [],
        },
      });
      promises.push(getHostConfig(hostname));
    });
  });

  const hostConfigs = await Promise.all(promises);
  hostConfigs.forEach((hostConfig) => {
    console.log(">>> getStaticPaths for", hostConfig.hostname);
    Object.keys(hostConfig.sitemap).forEach((path) => {
      if (!hostConfig.sitemap[path].googleDocId) return;
      if (hostConfig.sitemap[path].redirect) return; // `redirect` can not be returned from getStaticProps during prerendering
      paths.push({
        params: {
          host: hostConfig.hostname,
          path: path === "/" ? [] : path.split("/").filter((p) => p),
        },
      });
    });
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  let path, edit;
  let slug = "index";
  const hostname = params.host;

  if (params.path) {
    if (params.path[params.path.length - 1] === "edit") {
      params.path.pop();
      edit = true;
    }
    if (params.path[0] === hostname) {
      params.path.shift();
    }
    slug = params.path.join("/");
  }

  console.log("GET", hostname, slug);

  const host = {
    hostname,
  };

  let doc = {},
    error = null,
    pageInfo,
    googleDocId = isGoogleDocId(slug) ? slug : null;

  try {
    host.config = await getHostConfig(hostname);
    if (!host.config) {
      throw new Error("No host config found");
    }
    // console.info(">>> host.config", host.config);
    pageInfo = getPageMetadata(host.config, slug);
    console.info(">>> pageInfo", pageInfo);
    googleDocId = pageInfo.googleDocId;
  } catch (e) {
    console.error(">>> getPageMetadata error", hostname, slug, e);
    error = "invalid_host";
    pageInfo = {};
  }

  const iframeSrc = pageInfo.iframeSrc;

  if (edit) {
    if (!googleDocId && pageInfo.redirect) {
      pageInfo = getPageMetadata(host.config, pageInfo.redirect.substring(1));
      googleDocId = pageInfo.googleDocId;
    }
    return {
      redirect: {
        destination: `https://docs.google.com/document/d/${googleDocId}/edit`,
      },
    };
  }

  if (pageInfo.redirect) {
    return {
      redirect: {
        destination: pageInfo.redirect,
      },
    };
  }

  if (!iframeSrc) {
    if (!googleDocId) {
      console.error(">>> invalid_googledocid", googleDocId);
      error = error || "invalid_googledocid";
    } else {
      try {
        doc = await getHTMLFromGoogleDocId(googleDocId, host.config);
        // console.log(doc);
      } catch (e) {
        error = e.message;
        if (error === "not_published") {
          return {
            redirect: {
              destination: `https://docs.google.com/document/d/${googleDocId}/edit`,
            },
          };
        }
      }
    }

    if (!doc) {
      doc = {};
      error = `Could not get the HTML for this Google Doc ID (${googleDocId})`;
    }
  }

  let imagePreview = pageInfo.image;
  if (!imagePreview && doc.images) {
    imagePreview = (
      doc.images.find((img) => img.width > 320) ||
      doc.images[0] ||
      {}
    ).proxySrc;
  }

  const customCss = loadCustomCSS(hostname);
  const styles = doc.styles + "\n" + customCss;

  const page = {
    title: doc.title || pageInfo.title || null,
    description: pageInfo.description || doc.description || null,
    image: imagePreview || null,
    body: doc.body || null,
    outline: doc.outline || null,
    googleDocId: googleDocId || null,
    slug: pageInfo.slug || null,
    iframeSrc: iframeSrc || null,
    styles,
    error,
  };

  return {
    props: { host, page },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}

export default function Home(props) {
  const router = useRouter();

  const { host, page } = props;

  const [currentSection, setCurrentSection] = useState();
  const [currentDocWidth, setCurrentDocWidth] = useState(0);

  useEffect(() => {
    // we only highlight the current section on large screens
    // where the outline is visible side by side
    if (window.innerWidth < 768) return () => {};

    function addListeners() {
      window.addEventListener("scroll", logit);
      window.addEventListener("resize", computeOffset);
    }
    computeOffset();
    addListeners();
    return () => {
      window.removeEventListener("scroll", logit);
      window.removeEventListener("resize", computeOffset);
    };
  });

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div className="text-center mt-72 mx-8">Loading...</div>;
  }
  if (!props.page) {
    notFound();
    return null;
  }

  if (!page) return <div />;

  const {
    title,
    description,
    outline,
    body,
    image,
    googleDocId,
    error,
    iframeSrc,
  } = page;

  if (iframeSrc)
    return (
      <FullPageIframe
        src={iframeSrc}
        title={title}
        description={description}
        favicon={host.config.icon}
        image={absoluteUrl(image, host)}
      />
    );

  function changeCurrentSection(section) {
    setCurrentSection(section);
    const anchors = document.querySelectorAll("#outline a");
    if (anchors.length === 0) return;
    anchors.forEach((el) => {
      const href = el.getAttribute("href");
      if (href === `#${section}`) {
        el.classList.add("bg-gray-300");
        // console.log(">>> adding active to", el);
      } else {
        el.classList.remove("bg-gray-300");
      }
    });
    console.log(">>> current section", section);
    history.replaceState(
      null,
      null,
      document.location.pathname + (section ? "#" + section : "")
    );
  }

  function logit() {
    const y = window.scrollY;
    if (y % 5 !== 0) return false;

    let section = null,
      index = 0;

    if (!outline || outline.length === 0) return;
    outline.forEach((item, i) => {
      if (y >= item.offsetTop - 60) {
        section = item.slug;
        index = i;
      }
    });
    if (section !== currentSection) {
      changeCurrentSection(section);
    }
  }

  function computeOffset() {
    const docEl = document.querySelector("#document");
    if (!docEl) return;
    if (Math.abs(docEl.offsetWidth - currentDocWidth) < 50) {
      return;
    }
    setCurrentDocWidth(Number(docEl.offsetWidth) || 120);
    const subtitles = docEl.querySelectorAll("h1,h2,h3,h4,h5,h6");
    if (subtitles.length === 0) return;
    subtitles.forEach((el) => {
      const slug = el.getAttribute("id");
      const item = outline.find((o) => o.slug === slug);
      if (!item) return;
      item.offsetTop = el.offsetTop;
      item.el = el;
    });
  }

  let errorComponent = null;
  if (error) {
    switch (error) {
      case "invalid_googledocid":
        errorComponent = <ErrorInvalidDocId googleDocId={googleDocId} />;
        break;
      default:
        errorComponent = (
          <div className="p-8">
            <h2>Error 😔</h2>
            <p>{error}</p>
          </div>
        );
    }
  }

  return (
    <div className="w-full">
      <Head>
        <title>{title}</title>
        <link
          rel="icon"
          href={host.config && host.config.icon.src}
          sizes="32x32"
        />
        <meta
          name="description"
          property="og:description"
          content={description || ""}
        />
        <meta property="og:image" content={absoluteUrl(image, host.hostname)} />
        <meta
          property="og:image:type"
          content={imageType(image, host.hostname)}
        />
      </Head>

      <main className="relative min-h-screen w-full overflow-hidden dark:bg-gray-800 dark:text-gray-100">
        {page.styles && <style>{page.styles}</style>}
        {outline && (
          <Outline
            websiteTitle={host.config.title}
            websiteIcon={host.config.svgicon || host.config.icon}
            outline={outline}
            onChange={() => computeOffset()}
          />
        )}
        {!body && !error && <p>Loading...</p>}
        {errorComponent}
        {body && (
          <div className="flex flex-col w-full mx-auto justify-center">
            <div
              id="document"
              className={`${page.slug} content px-4 mx-auto w-full max-w-screen-md flex-1`}
            >
              <RenderGoogleDoc html={body} />
            </div>
            <Footer
              sitemap={host.config.sitemap}
              websiteTitle={host.config.title}
              websiteIcon={host.config.icon}
              googleDocId={googleDocId}
            />
          </div>
        )}

        {/* make sure tailwind includes the table tr td .imageWrapper.fullWidth classes in production */}
        <table className="hidden">
          <tbody>
            <tr>
              <td>
                <span className="imageWrapper fullWidth"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}
