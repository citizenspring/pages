import { notFound } from "next/navigation";
import Head from "next/head";
import { getHTMLFromGoogleDocId } from "../../lib/googledoc";
import {
  getPageMetadata,
  absoluteUrl,
  imageType,
  loadCustomCSS,
  getSitemap,
} from "../../lib/lib";
import Outline from "../../components/Outline";
import Footer from "../../components/Footer";
import ErrorInvalidDocId from "../../components/ErrorInvalidDocId";
import RenderGoogleDoc from "../../components/RenderGoogleDoc";
import FullPageIframe from "../../components/FullPageIframe";
import sitemap from "../../sitemap.json";
import { useEffect, useState } from "react";

export async function getStaticPaths() {
  const paths = [];
  Object.keys(sitemap).forEach((hostKey) => {
    sitemap[hostKey].hosts.forEach((host) => {
      Object.keys(sitemap[hostKey].sitemap).forEach((key) => {
        if (key.match(/^collectives/)) return;
        if (sitemap[hostKey].sitemap[key].redirect) return; // `redirect` can not be returned from getStaticProps during prerendering
        if (!sitemap[hostKey].sitemap[key].googleDocId) return;
        paths.push({
          params: {
            host,
            path: [sitemap[hostKey].sitemap[key].googleDocId],
          },
        });
        if (sitemap[hostKey].sitemap[key].aliases) {
          sitemap[hostKey].sitemap[key].aliases.map((alias) => {
            paths.push({
              params: {
                host,
                path: [...alias.split("/")],
              },
            });
          });
        }
        paths.push({
          params: {
            host,
            path: [...key.split("/")],
          },
        });
        if (key === "index") {
          paths.push({
            params: {
              host,
              path: [],
            },
          });
        }
      });
    });
  });

  // console.log(
  //   paths
  //     .map((p) => `${p.params.host} ${p.params.path.join("/")}`)
  //     .filter((p) => p.match(/dao.local/))
  // );
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  let path, edit;
  let slug = "index";
  const host = params.host;

  if (params.path) {
    if (params.path[params.path.length - 1] === "edit") {
      params.path.pop();
      edit = true;
    }
    if (params.path[0] === host) {
      params.path.shift();
    }
    slug = params.path.join("/");
  }

  console.log("GET", host, slug);

  let doc = {},
    error = null,
    hostSitemap,
    pageInfo;

  try {
    hostSitemap = getSitemap(host);
    pageInfo = getPageMetadata(host, slug, hostSitemap);
  } catch (e) {
    console.log(">>> getPageMetadata error", host, slug, e);
    error = "invalid_host";
    pageInfo = {};
  }

  const googleDocId = pageInfo.googleDocId || (params.path && params.path[0]);
  const iframeSrc = pageInfo.iframeSrc;

  if (edit) {
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
        doc = await getHTMLFromGoogleDocId(googleDocId);
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
      doc.images.find((img) => img.width > 512) ||
      doc.images[0] ||
      {}
    ).src;
  }

  const customCss = loadCustomCSS(host);

  const page = {
    title: pageInfo.title || doc.title || null,
    description: pageInfo.description || doc.description || null,
    favicon: pageInfo.favicon || null,
    icon: pageInfo.icon || null,
    image: imagePreview || null,
    body: doc.body || null,
    outline: doc.outline || null,
    googleDocId: googleDocId || null,
    slug: pageInfo.slug || null,
    iframeSrc: iframeSrc || null,
    customCss,
    host,
    sitemap: hostSitemap,
    error,
  };

  return {
    props: { page },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}

export default function Home(props) {
  if (!props.page) {
    notFound();
    return null;
  }
  const { page } = props;
  if (!page) return <div />;
  const {
    title,
    description,
    icon,
    favicon,
    outline,
    body,
    image,
    googleDocId,
    error,
    iframeSrc,
    host,
    sitemap,
  } = page;

  let defaultValues;
  try {
    defaultValues = getPageMetadata(page.host, "index");
  } catch (e) {
    defaultValues = {};
  }

  const homeTitle = defaultValues.title;
  const homeIcon = defaultValues.icon || defaultValues.favicon;

  const [currentSection, setCurrentSection] = useState();
  const [currentDocWidth, setCurrentDocWidth] = useState(0);

  if (iframeSrc)
    return (
      <FullPageIframe
        src={iframeSrc}
        title={title}
        description={description || defaultValues.description}
        favicon={favicon || defaultValues.favicon}
        image={absoluteUrl(image || defaultValues.image, host)}
      />
    );

  function changeCurrentSection(section) {
    setCurrentSection(section);
    document.querySelectorAll("#outline a").forEach((el) => {
      const href = el.getAttribute("href");
      if (href === `#${section}`) {
        el.classList.add("bg-gray-300");
        console.log(">>> adding active to", el);
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
    docEl.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((el) => {
      const slug = el.getAttribute("id");
      const item = outline.find((o) => o.slug === slug);
      if (!item) return;
      item.offsetTop = el.offsetTop;
      item.el = el;
    });
  }

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
        <title>{title || defaultValues.title}</title>
        <link
          rel="icon"
          href={favicon || defaultValues.favicon}
          sizes="32x32"
        />
        <meta
          name="description"
          property="og:description"
          content={description || defaultValues.description}
        />
        <meta
          property="og:image"
          content={absoluteUrl(image || defaultValues.image, host)}
        />
        <meta
          property="og:image:type"
          content={imageType(image || defaultValues.image, host)}
        />
        {page.customCss && <style>{page.customCss}</style>}
      </Head>

      <main className="relative min-h-screen w-full overflow-hidden">
        {outline && (
          <Outline
            homeTitle={homeTitle}
            homeIcon={homeIcon}
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
              className={`${page.slug} content px-4 mx-auto max-w-screen-md flex-1`}
            >
              <RenderGoogleDoc html={body} />
            </div>
            <Footer
              sitemap={sitemap}
              homeTitle={homeTitle}
              homeIcon={homeIcon}
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
