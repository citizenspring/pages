import fs from "fs";
import path from "path";
import { fetchGoogleDoc, extractMetadata, proxyImage } from "./googledoc";
import hosts from "../hosts.json";
import NodeCache from "node-cache";
const configCache = new NodeCache({ stdTTL: 60 * 5 }); // 5 minutes

// build index by googleDocId for lookups
const googleDocIds = {};
Object.keys(hosts).forEach((hostKey) => {
  if (!hosts[hostKey].sitemap) return;
  Object.keys(hosts[hostKey].sitemap).forEach((path) => {
    const pageInfo = hosts[hostKey].sitemap[path];
    pageInfo.slug = path;
    pageInfo.hosts = hosts[hostKey].hosts;
    googleDocIds[pageInfo.googleDocId] = pageInfo;
  });
});

/**
 * Get googleDocId of a given host
 * @param {*} host
 * @returns
 */
export function getHostGoogleDocId(hostname) {
  if (!hostname) throw new Error("hostname is required");
  if (hosts[hostname.toLowerCase()])
    return hosts[hostname.toLowerCase()].googleDocId;
  let hostSitemap;
  const hostnames = Object.keys(hosts);

  let i = -1;
  while (i++ < hostnames.length - 1 && !hostSitemap) {
    if (!hosts[hostnames[i]].hosts || hosts[hostnames[i]].hosts.length === 0)
      continue;

    const found = hosts[hostnames[i]].hosts.find(
      (h) => h === hostname.toLowerCase()
    );
    if (found) return hosts[hostnames[i]].googleDocId;
  }
  console.error(
    `lib/getHostGoogleDocId> Cannot find googleDocId for host ${hostname}`
  );
  throw new Error(`host (${hostname}) not configured (missing googleDocId)`);
}

async function loadHostConfigFromGoogleDocId(host) {
  console.log(">>> loadHostConfigFromGoogleDocId", host.googleDocId, host);
  const metadata = extractMetadata(
    await fetchGoogleDoc(host.googleDocId, host.format || "html")
  );
  let icon;
  if (metadata.icon && metadata.icon.src) {
    icon = await proxyImage(host.googleDocId, metadata.icon);
  } else {
    icon = { src: host.svgicon || host.favicon || host.icon || "/favicon.ico" };
  }
  metadata.sitemap = metadata.sitemap || {};
  metadata.sitemap["/"] = {
    title: metadata.title || null,
    path: "/",
    slug: "index",
    googleDocId: host.googleDocId,
  };
  const config = {
    ...host,
    title: metadata.title || host.title,
    icon: icon || null,
    sitemap: metadata.sitemap,
    redirections: metadata.redirections || null,
    googleDocId: host.googleDocId,
  };
  return config;
}

/**
 * Get config of a given host
 * @param {*} hostname
 * @returns
 */
export async function getHostConfig(hostname) {
  if (configCache.has(hostname)) {
    console.log(">>> getHostConfig from cache", hostname);
    return Promise.resolve(configCache.get(hostname));
  }
  console.log(">>> getHostConfig", hostname);

  let hostConfig = {};

  if (hosts[hostname.toLowerCase()]) {
    hostConfig = hosts[hostname.toLowerCase()];
  } else {
    // We look for hostConfig based on the hosts array
    const hostnames = Object.keys(hosts);
    hostnames.forEach((h) => {
      const host = hosts[h];
      if (host.hosts && host.hosts.indexOf(hostname.toLowerCase()) !== -1) {
        hostConfig = host;
        return;
      }
    });
  }

  let res = {};

  // Adapt old config file format
  if (hostConfig.sitemap) {
    const hostConfigWithSitemap = {};
    const sitemap = {};
    const slugs = Object.keys(hostConfig.sitemap);

    for (let i = 0; i < slugs.length; i++) {
      const slug = slugs[i];
      if (slug.substring(1) === "/") continue;
      const path = slug === "index" ? "/" : `/${slug}`;
      const pageInfo = hostConfig.sitemap[slug];
      sitemap[path] = Object.assign({}, pageInfo, { path });
      if (slug === "index") {
        hostConfigWithSitemap.icon = {
          src:
            pageInfo.svgicon ||
            pageInfo.icon ||
            pageInfo.favicon ||
            "/favicon.ico",
        };
        hostConfigWithSitemap.title = pageInfo.title;
        hostConfigWithSitemap.googleDocId = pageInfo.googleDocId;
      }
    }
    hostConfigWithSitemap.hostname = hostname;
    hostConfigWithSitemap.sitemap = sitemap;
    res = hostConfigWithSitemap;
  }
  if (hostConfig.googleDocId) {
    const hostConfigFromGoogleDoc = await loadHostConfigFromGoogleDocId(
      hostConfig
    );
    hostConfigFromGoogleDoc.hostname = hostname;
    res = { ...res, ...hostConfigFromGoogleDoc };
  }
  console.log(">>> hostConfig", res);
  configCache.set(hostname, res);
  return res;
}

/**
 * Get the sitemap for the host (note: a site can have multiple hosts)
 * @param {*} host
 * @returns
 */
export async function getSitemap(host) {
  const hostConfig = await getHostConfig(host);
  return hostConfig.sitemap;
}

export function getPageMetadataByGoogleDocId(sitemap, googleDocId) {
  let pageInfo;
  Object.keys(sitemap).forEach((path) => {
    if (sitemap[path].googleDocId === googleDocId) {
      pageInfo = sitemap[path];
      return;
    }
  });
  return pageInfo;
}

export function isGoogleDocId(str) {
  return str && str.match(/^1[a-zA-Z0-9-_]{43}$/);
}

/**
 * Get the page metadata (title, description, googleDocId, image, ...) from sitemap.json
 * @param host current host
 * @param path can be either a slug/path or the googleDocId
 * @returns the page metadata
 */
export function getPageMetadata(hostConfig, slug) {
  // console.log(">>> getPageMetadata for slug", slug);
  const path = slug === "index" ? "/" : `/${(slug || "").toLowerCase()}`;
  const pageInfo = hostConfig.sitemap[path];
  if (!pageInfo) {
    console.info(
      `No match found for path ${path} in sitemap`,
      hostConfig.sitemap
    );
    if (isGoogleDocId(slug)) {
      pageInfo.googleDocId = slug;
      pageInfo.href = path;
      pageInfo.title = "";
    } else if (path.length <= 1) {
      pageInfo.googleDocId = hostConfig.googleDocId;
      pageInfo.title = hostConfig.title;
      pageInfo.href = "/";
    } else {
      throw new Error(`Invalid path ${path}`);
    }
  } else {
    pageInfo.title = pageInfo.title || hostConfig.title;
  }
  return pageInfo;
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
  const cssFilePath = path.join(process.cwd(), "public", host, "styles.css");
  // console.log(">>> loadCustomCSS", cssFilePath);
  try {
    const cssContent = fs.readFileSync(cssFilePath, "utf-8");
    const minifiedCss = cssContent
      .replace(/(\r\n|\n|\r)/gm, " ")
      .replace(/ +/g, " ");
    return minifiedCss;
  } catch (e) {
    // console.info(`No custom CSS found for host ${host}`);
    return "";
  }
}
