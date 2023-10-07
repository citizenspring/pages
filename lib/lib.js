import sitemap from "../sitemap.json";
import fs from "fs";

// build index by googleDocId for lookups
const googleDocIds = {};
Object.keys(sitemap).forEach((hostKey) => {
  Object.keys(sitemap[hostKey].sitemap).forEach((path) => {
    const pageInfo = sitemap[hostKey].sitemap[path];
    pageInfo.slug = path;
    pageInfo.hosts = sitemap[hostKey].hosts;
    googleDocIds[pageInfo.googleDocId] = pageInfo;
  });
});

/**
 * Get config of a given host
 * @param {*} host
 * @returns
 */
export function getHostConfig(host) {
  if (sitemap[host.toLowerCase()]) return sitemap[host.toLowerCase()];
  let hostSitemap;
  const hosts = Object.keys(sitemap);

  let i = -1;
  while (i++ < hosts.length - 1 && !hostSitemap) {
    if (!sitemap[hosts[i]].hosts || sitemap[hosts[i]].hosts.length === 0)
      continue;

    const found = sitemap[hosts[i]].hosts.find((h) => h === host.toLowerCase());
    if (found) return sitemap[hosts[i]];
  }
  console.error(`lib/getSitemap> Cannot find config for host ${host}`);
  throw new Error(`host (${host}) not configured`);
}

/**
 * Get the sitemap for the host (note: a site can have multiple hosts)
 * @param {*} host
 * @returns
 */
export function getSitemap(host) {
  const hostConfig = getHostConfig(host);
  return hostConfig.sitemap;
}

export function getPageMetadataByGoogleDocId(googleDocId) {
  return googleDocIds[googleDocId];
}

/**
 * Get the page metadata (title, description, googleDocId, image, ...) from sitemap.json
 * @param host current host
 * @param path can be either a slug/path or the googleDocId
 * @returns the page metadata
 */
export function getPageMetadata(host, path) {
  const hostSitemap = getSitemap(host);
  console.log(">>> getPageMetadata", host, path);
  let pageInfo = hostSitemap[path ? path.toLowerCase() : "index"];
  if (!pageInfo) {
    // search by googleDocId or alias
    Object.keys(hostSitemap).forEach((key) => {
      if (
        hostSitemap[key].googleDocId === path ||
        (hostSitemap[key].aliases &&
          hostSitemap[key].aliases.indexOf(path.toLowerCase()) !== -1)
      ) {
        pageInfo = hostSitemap[key];
        pageInfo.slug = key;
      }
    });
  }
  console.log(">>> getPageMetadata result:", pageInfo);
  return pageInfo || {};
}

export function absoluteUrl(relativeUrl, host) {
  if (!relativeUrl) return "";
  if (relativeUrl.substring(0, 4) === "http") return relativeUrl;
  return "https://" + host + relativeUrl;
}

export function imageType(imageUrl) {
  if (!imageUrl) return "";
  const imageExtension = imageUrl.substring(imageUrl.lastIndexOf(".") + 1);
  switch (imageExtension) {
    case "png":
    case "gif":
      return `image/${imageExtension}`;
    default:
      return "image/jpeg";
  }
}

export function loadCustomCSS(host) {
  const cssFilePath = `./public/${host}/styles.css`; // Replace with the actual path to your CSS files
  try {
    const cssContent = fs.readFileSync(cssFilePath, "utf-8");
    return cssContent;
  } catch (e) {
    console.info(`No custom CSS found for host ${host}`, e);
    return "";
  }
}
