import cheerio from "cheerio";
import { renderToString } from "react-dom/server";
import XMLToReact from "@xdamman/xml-to-react";
import YouTubeEmbed from "../components/YouTubeEmbed";
import FacebookVideoEmbed from "../components/FacebookVideoEmbed";
import VimeoEmbed from "../components/VimeoEmbed";
import LoomEmbed from "../components/LoomEmbed";
import GoogleCalendar from "../components/GoogleCalendar";
import TwitterEmbed from "../components/TwitterEmbed";
import Button from "../components/Button";
import slugify from "slugify";
import { decode } from "html-entities";
import crypto from "crypto";
import NodeCache from "node-cache";
import React from "react";

function removeGoogleURLRedirect(href) {
  if (!href) return "";
  return decodeURIComponent(href)
    .replace("https://www.google.com/url?q=", "")
    .replace(/&amp;/g, "&")
    .replace(/&sa=D(&source=.+)?&ust=[0-9]+&usg=.{28}/, "");
}
// Remove Google Redirect and turn links to other Google Docs to pages
// e.g. https://docs.google.com/document/d/1Nl9JsoDPHHGtoQAHWaY-7GAsrTur8XixemGZsIKb9Vs/edit#heading=h.xgnlbr1pklz4
// e.g. https://docs.google.com/document/u/0/d/1Nl9JsoDPHHGtoQAHWaY-7GAsrTur8XixemGZsIKb9Vs/edit#heading=h.xgnlbr1pklz4
// become internal links /1Nl9JsoDPHHGtoQAHWaY-7GAsrTur8XixemGZsIKb9Vs
function rewriteUrlsWithSitemap(sitemap, body) {
  if (!body) return "";
  const newBody = body.replaceAll(
    /https:\/\/docs.google.com\/document\/(?:u\/[0-9]\/)?d\/(.{44})[^"]*/gi,
    (match, p1) => {
      if (
        match.indexOf("docs.google.com/document/") !== -1 &&
        match.indexOf("/copy") === -1
      ) {
        const googleDocId = p1;
        const pageInfo = getPageMetadataByGoogleDocId(sitemap, googleDocId);
        if (pageInfo) {
          return pageInfo.path || `/${pageInfo.slug || p1}`;
        }
      }
      return match;
    }
  );
  return newBody;
}

function cleanHTML(html) {
  // console.log(html.replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, ""));
  return (
    html
      .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, "")
      .replace(
        /<p class="c[0-9]+( c[0-9]+)?"><span class="c[0-9]+( c[0-9]+)?">(\s+)?<\/span><\/p>/gi,
        "<p class='empty'></p>"
      )
      // iframes
      .replace(
        /&lt;iframe ([^<]+)&gt;&lt;\/iframe&gt;/gi,
        (match, p1) => `<iframe ${p1.replace(/&quot;/gi, '"')} />`
      )
      // Youtube embeds
      .replace(
        /<a [^>]*>https?:\/\/(www\.)?(youtu.be\/|youtube.com\/(embed\/|watch\?v=))([a-z0-9_-]{11})[^<]*<\/a>/gi,
        (match, p1, p2, p3, p4) => `<YouTube id="${p4}" />`
      )
      // Vimeo embeds
      .replace(
        /<a [^>]*>https?:\/\/(www\.)?vimeo.com\/([0-9]+)[^<]*<\/a>/gi,
        (match, p1, p2, p3, p4) => `<Vimeo id="${p2}" />`
      )
      // Facebook video embeds
      // e.g. https://fb.watch/g7VLn9usDR/
      .replace(
        /<a [^>]*>(https?:\/\/fb.watch\/[^\/]+)[^<]*<\/a>/gi,
        (match, p1, p2, p3, p4) => `<FacebookVideo videoUrl="${p1}" />`
      )
      // e.g. https://www.facebook.com/watch/?v=1052376648744351
      .replace(
        /<a [^>]*>(https?:\/\/(www\.)?facebook.com\/watch\/?\?v=[0-9]+)[^<]*<\/a>/gi,
        (match, p1, p2, p3, p4) => `<FacebookVideo videoUrl="${p1}" />`
      )
      // e.g. https://www.facebook.com/100064854334398/videos/1052376648744351/
      .replace(
        /<a [^>]*>(https?:\/\/(www\.)?facebook.com\/[0-9]+\/videos\/[0-9]+)[^<]*<\/a>/gi,
        (match, p1, p2, p3, p4) => `<FacebookVideo videoUrl="${p1}" />`
      )
      // Loom embeds
      .replace(
        /<a [^>]*>https?:\/\/(www\.)?loom\.com\/(embed|share)\/([a-z0-9_-]{32})[^<]*<\/a>/gi,
        (match, p1, p2, p3, p4) => `<Loom id="${p3}" />`
      )
      // Google Calendar embeds
      .replace(
        /<a [^>]*>https?:\/\/calendar.google.com\/calendar\/u\/0\/embed\?ctz=([^&]+)&amp;src=([^"]+)[^<]*<\/a>/gi,
        (match, p1, p2, p3, p4) => `<GoogleCalendar ctz="${p1}" src="${p2}" />`
      )
      // Support for custom components
      // <ComponentName attr1="value1" attr2="value2" />
      .replace(
        />\&lt;(\S+) ([^<]+)\/?\&gt;</gi,
        (match, component, attributes) => {
          const params = {};
          const matches = attributes.matchAll(
            /(\S+)=["'”]?((?:.(?!["'”]?\s+(?:\S+)=|\s*\/?[>"'”]))+.)["'”]?/gi
          );
          [...matches].forEach((param) => {
            const attr = param[1];
            const value = param[2];
            params[attr] = value;
          });
          // console.log(">>> component", component, "params", params);
          let component_str = "";
          if (component && component.toLowerCase() === "airtable") {
            component_str = `<airtable base="${params.base}" table="${params.table}" />`;
          }
          if (component && component.toLowerCase() === "balance") {
            component_str = `<balance chain="${params.chain}" address="${params.address}" token="${params.token}" />`;
          }
          return `>${component_str}<`;
        }
      )
      // Twitter embed
      .replace(
        /<a [^>]*>(https?:\/\/(www\.)?twitter.com\/(.){1,15}\/status(es)?\/([0-9]+)[^<]*)<\/a>/gi,
        (match, p1, p2, p3, p4, p5) => `<Twitter tweetUrl="${p1}" />`
      )
      // Support for [[primary button]] and [secondary button]
      // <span>[</span><span><a href="">button</a></span><span>]</span>
      .replace(
        /<span[^>]*>\s*(\[+)\s*<\/span><span[^>]*><a( class="[^"]+")? href="([^"]+)"[^>]*>([^<]*)<\/a><\/span>(<span>\s*<\/span>)?<span[^>]*>\s*\]+\s*<\/span>/gim,
        (match, border, classes, href, label) => {
          return `<Button href="${removeGoogleURLRedirect(href)}" ${
            border.length == 2 ? 'primary="true"' : ""
          }>${label}</Button>`;
        }
      )
      // <a href="">[button]</a>
      .replace(
        /<a( class="[^"]+")? href="([^"]+)">\s*(\[+)\s*([^<]+)\s*\]+\s*<\/a>/gi,
        (match, classes, href, border, label) => {
          return `<Button href="${removeGoogleURLRedirect(href)}" ${
            border.length == 2 ? 'primary="true"' : ""
          }>${label}</Button>`;
        }
      )
      .replace(/<img ([^>]+)>/gi, "<img $1 />")
      .replace(/ (alt|title)=""/gi, "")
      .replace(/<hr style="page-break[^"]+">/gi, '<div class="pagebreak" />')
  );
}

function convertDomToReactTree(xml, classes) {
  if (!xml) {
    // console.log(">>> calling convertDomToReactTree with", `"${xml}"`, classes);
    throw new Error("No XML provided to convertDomToReactTree");
  }

  const $ = cheerio.load(xml, { xmlMode: true });

  function Image({
    children,
    i,
    src,
    width,
    height,
    className,
    containerStyle,
  }) {
    return (
      <span className={className} style={containerStyle}>
        <img src={src} width={width} height={height} />
      </span>
    );
  }

  function ImageConverter(attrs, data = {}) {
    const { children, i, src, style } = attrs;
    const size = style.match(/width: ([0-9]+).*height: ([0-9]+)/i);
    const parentStyle = $(`img[src="${src}"]`).parent().first().attr("style");
    const parentClass = $(`img[src="${src}"]`)
      .parent()
      .first()
      .parent()
      .first()
      .attr("class");
    const transform = parentStyle.match(/ transform: ([^;]+);/i);
    const margin = parentStyle.match(/ margin: ([^;]+);/i);
    const containerStyle = {
      display: "block",
      transform: transform[1],
      // margin: margin[1],
    };
    let parentClassStyles = classes[parentClass];
    // if the parent has more than one class, we need to merge the styles
    if (!parentClassStyles && parentClass.match(/\s/)) {
      parentClassStyles = "";
      parentClass.split(" ").map((className) => {
        parentClassStyles += classes[className] + ";";
      });
    }
    const wrapperClasses = ["imageWrapper"];
    if (size[1] > 500) {
      containerStyle.textAlign = "center";
      wrapperClasses.push("fullWidth");
    } else {
      if (parentClassStyles.match(/text-align:center/)) {
        containerStyle.margin = "0 auto";
        containerStyle.textAlign = "center";
      }
      containerStyle.maxWidth = Math.round(size[1]);
    }
    const width = Math.round(size[1]);
    const height = Math.round(size[2]);
    data.images.push({ src, width, height });
    const className = wrapperClasses.join(" ");
    return {
      type: () =>
        Image({
          src,
          width,
          height,
          className,
          containerStyle,
        }),
      attrs,
    };
  }

  function Br({ children }) {
    return (
      <span>
        <br />
        {children}
      </span>
    );
  }

  function Hr({ children }) {
    return (
      <div>
        <hr />
        {children}
      </div>
    );
  }

  function Link({ children, href, className }) {
    if (!href) return null;
    let linkText = children,
      title = "";
    let newValue = removeGoogleURLRedirect(href);
    // console.log(">>> Link", href, "new value", newValue);

    // Limit display links to 40 chars (since they don't wrap)
    if (linkText.length > 40 && linkText.match(/^https?:\/\/[^ ]+$/)) {
      title = linkText;
      linkText = `${linkText
        .replace(/https?:\/\/(www\.)?/, "", "i")
        .substr(0, 39)}…`;
    }

    return (
      <span>
        <a href={newValue} className={className} title={title}>
          {linkText}
        </a>
      </span>
    );
  }

  const xmlToReact = new XMLToReact({
    html: () => ({ type: "html" }),
    body: () => ({ type: "body" }),
    // style: (attrs) => ({ type: "style", props: attrs }),
    div: (attrs) => ({ type: "div", props: { className: attrs.class } }),
    span: (attrs) => ({
      type: "span",
      props: { className: attrs.class },
    }),
    a: (attrs) => ({
      type: Link,
      props: { className: attrs.class, href: attrs.href },
    }),
    p: (attrs) => ({ type: "p", props: { className: attrs.class } }),
    br: (attrs) => ({ type: Br, props: { className: attrs.class } }),
    hr: (attrs) => ({ type: Hr, props: { className: attrs.class } }),
    h1: (attrs) => ({
      type: "h1",
      props: { className: attrs.class, id: attrs.id },
    }),
    h2: (attrs) => ({
      type: "h2",
      props: { className: attrs.class, id: attrs.id },
    }),
    h3: (attrs) => ({
      type: "h3",
      props: { className: attrs.class, id: attrs.id },
    }),
    h4: (attrs) => ({
      type: "h4",
      props: { className: attrs.class, id: attrs.id },
    }),
    h5: (attrs) => ({
      type: "h5",
      props: { className: attrs.class, id: attrs.id },
    }),
    ul: (attrs) => ({ type: "ul", props: { className: attrs.class } }),
    ol: (attrs) => ({ type: "ol", props: { className: attrs.class } }),
    li: (attrs) => ({ type: "li", props: { className: attrs.class } }),
    iframe: (attrs) => ({
      type: "iframe",
      props: {
        src: attrs.src,
        frameBorder: attrs.frameborder,
        scrolling: attrs.scrolling,
        // style: attrs.style, // The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX
        width: attrs.width,
        height: attrs.height,
      },
    }),
    table: (attrs) => ({ type: "table", props: { className: attrs.class } }),
    thead: (attrs) => ({ type: "thead", props: { className: attrs.class } }),
    tbody: (attrs) => ({ type: "tbody", props: { className: attrs.class } }),
    tr: (attrs) => ({ type: "tr", props: { className: attrs.class } }),
    td: (attrs) => ({
      type: "td",
      props: {
        className: attrs.class,
        rowSpan: attrs.rowspan,
        colSpan: attrs.colspan,
      },
    }),
    Button: (attrs) => ({
      type: Button,
      props: { label: attrs.label, href: attrs.href, primary: attrs.primary },
    }),
    YouTube: (attrs) => ({ type: YouTubeEmbed, props: { id: attrs.id } }),
    FacebookVideo: (attrs) => ({
      type: FacebookVideoEmbed,
      props: { videoUrl: attrs.videoUrl },
    }),
    Vimeo: (attrs) => ({ type: VimeoEmbed, props: { id: attrs.id } }),
    Loom: (attrs) => ({ type: LoomEmbed, props: { id: attrs.id } }),
    GoogleCalendar: (attrs) => ({
      type: GoogleCalendar,
      props: { src: attrs.src, ctz: attrs.ctz },
    }),
    airtable: (attrs) => ({
      type: "airtable",
      props: { base: attrs.base, table: attrs.table },
    }),
    balance: (attrs) => ({
      type: "balance",
      props: { chain: attrs.chain, address: attrs.address, token: attrs.token },
    }),
    Twitter: (attrs) => ({
      type: TwitterEmbed,
      props: { tweetUrl: attrs.tweetUrl },
    }),
    img: ImageConverter,
  });
  let reactTree;
  const data = { images: [] };
  try {
    reactTree = xmlToReact.convert(xml, data);
  } catch (e) {
    console.log("ERROR convert xmltoreact:", e);
  }
  return { reactTree, images: data.images };
}

export function extractMetadata(html) {
  const lastIndexOf = html.lastIndexOf("<hr");
  if (lastIndexOf === -1) return { body: html };

  const body = html.substring(0, lastIndexOf);
  const footer = html.substring(lastIndexOf);
  const $ = cheerio.load(footer, { xmlMode: true });
  const sitemap = {};
  const redirections = {};
  const title = $("h1").text();
  const iconsrc = $("img").first().attr("src");
  let icon = null;
  if (iconsrc) {
    icon = { src: iconsrc };
    const style = $("img").first().attr("style");
    if (style) {
      const size = style.match(/width: ([0-9]+).*height: ([0-9]+)/i);
      icon.width = Math.round(size[1]);
      icon.height = Math.round(size[2]);
    }
  }
  $("p").each((i, e) => {
    const pathInfo = {};

    let line = $(e).text();

    if (line.match(/^\(.*\)$/)) {
      line = line.substring(1, line.length - 1);
      pathInfo.hidden = true;
    }

    const parts = line.split(",").map((s) => s.trim());

    if (parts.length === 1) return;

    pathInfo.path = parts[0].toLowerCase();
    pathInfo.title = parts[1];
    const href = $(e).find("a").attr("href");
    if (href) {
      pathInfo.href = removeGoogleURLRedirect(href);
      const matches = href.match(
        /https:\/\/docs.google.com\/document\/(?:u\/[0-9]\/)?d\/(.{44})/i
      );
      if (matches && matches[1]) {
        pathInfo.googleDocId = matches[1];
      } else {
        pathInfo.redirect = pathInfo.href;
        redirections[pathInfo.path] = pathInfo.href;
      }
    } else {
      pathInfo.redirect = parts[parts.length - 1];
      redirections[pathInfo.path] = parts[parts.length - 1];
    }
    sitemap[pathInfo.path] = pathInfo;
  });
  if (Object.keys(sitemap).length === 0) return { body: html };
  return { body, title, sitemap, redirections, icon };
}

const processHTML = (htmlText) => {
  if (htmlText.indexOf("#email-display") !== -1) {
    throw new Error("not_published");
  }
  const classes = {};
  let cleaned = cleanHTML(htmlText);
  const $ = cheerio.load(cleaned, { xmlMode: true });
  const styles = decode($("#contents style").html());
  const importStylesMatches = styles.match(/@import url\(([^)]+)\);/gi);
  const importStyles = importStylesMatches ? importStylesMatches[0] : "";
  styles.replace(/\.(c[0-9]+)\{([^\}]*)}/g, (match, className, css) => {
    classes[className] = css;
    return match;
  });
  const newStyles =
    importStyles +
    "\n" +
    styles.replace(/([^{]+){([^}]+)}/gi, (matches, selector, style) => {
      if (selector && selector.match(/\.c[0-9]+/)) {
        // return matches;
        return (
          matches
            // .replace(/font-family:[^;}]+;?/gi, "")
            .replace(/line-height:[^;}]+;?/gi, "")
            .replace(
              /(margin|padding)(-(top|right|bottom|left))?:[^};]+\;?/gi,
              ""
            )
        );
      } else return "";
    });

  let title = null,
    description = null;
  $("h1,h2,p").each((i, e) => {
    if (["h1"].includes(e.name)) {
      const text = $(e).text();
      if (text && !title) {
        title = text;
      }
    } else if (!description) {
      description = $(e).text();
    }
  });

  let outline = [];
  $("h1, h2, h3, h4, h5, h6").each((i, e) => {
    const level = Number(e.name.substr(1)) - 1;
    const title = $(e).text();
    if (!title) return;
    const slug = slugify(title).toLowerCase();
    outline.push({ level, title, slug });
    $(e).attr("id", slug);

    // console.log(
    //   ">>> title",
    //   level,
    //   e.name,
    //   typeof e.children,
    //   "text:",
    //   $(e).text()
    // );
  });

  $("#contents > div").removeClass(); // remove the first container that has a max-width
  const xml = $("<div/>").append($("#contents > div")).html();
  // console.log(">>> xml", xml);
  const { reactTree, images } = convertDomToReactTree(xml, classes);
  try {
    const body = renderToString(reactTree);
    return {
      title,
      description,
      outline,
      body,
      images,
      styles: newStyles,
    };
  } catch (e) {
    console.log("!!! processHTML > renderToString error", e);
  }
};

export async function fetchGoogleDoc(docid) {
  if (!isGoogleDocId(docid)) {
    throw new Error(`invalid_googledocid (${docid})`);
  }
  const googledoc = `https://docs.google.com/document/d/${docid}`;
  let res;
  try {
    console.log(">>> loading google doc", googledoc);
    res = await fetch(`${googledoc}/pub`);
    if (res.status !== 200) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  } catch (e) {
    console.log(
      "!!! getHTMLFromGoogleDocId > cannot fetch",
      `${googledoc}/pub`,
      e
    );
    if (e.code === 401 || (e.message && e.message.match(/unauthorized/i))) {
      throw new Error("not_published"); // unauthorized, redirect to the google doc id
    }
  }

  const htmlText = await res.text();
  if (
    htmlText.match("This document is not published") ||
    htmlText.match(/<form action="\/v[0-9]\/signin\//gi)
  ) {
    throw new Error("not_published");
  }
  return htmlText;
}

const proxyImageCache = new NodeCache({ stdTTL: 60 * 60 * 24 * 7 }); // 1 week
export async function proxyImage(docid, image) {
  if (proxyImageCache.has(image.src)) {
    console.log(">>> return cached version for image", image.src);
    return proxyImageCache.get(image.src);
  }
  // console.log(">>> proxyImage fetching", image.src);
  const fetchData = await fetch(image.src);
  const buffer = Buffer.from(await fetchData.arrayBuffer());
  const md5 = crypto.createHash("md5").update(buffer).digest("hex");
  const filesize = parseInt(fetchData.headers.get("content-length"));
  const filetype = fetchData.headers.get("content-type");
  const proxySrc = `/api/image?googleDocId=${docid}&imageHash=${md5}`;
  const res = { ...image, filesize, filetype, md5, proxySrc };
  proxyImageCache.set(image.src, res);
  return res;
}

const googleDocCache = new NodeCache({ stdTTL: 60 }); // 1 minute
export async function getHTMLFromGoogleDocId(docid, hostConfig) {
  if (googleDocCache.has(docid)) {
    console.log(">>> return cached version for docid", docid);
    return googleDocCache.get(docid);
  }
  const htmlText = await fetchGoogleDoc(docid);
  const doc = processHTML(htmlText);

  if (!doc) throw new Error(`Unable to process google doc id ${docid}`);
  if (doc.images && doc.images.length > 0) {
    doc.images = await Promise.all(
      doc.images.map((image) => proxyImage(docid, image))
    );
    doc.images.forEach((image) => {
      doc.body = doc.body.replace(image.src, image.proxySrc);
    });
  }
  const { body, sitemap, icon, redirections } = extractMetadata(doc.body);
  doc.body = rewriteUrlsWithSitemap(hostConfig.sitemap, body);
  doc.sitemap = sitemap || null;
  doc.icon = icon || null;
  googleDocCache.set(docid, doc);
  return doc;
}
