import sitemap from "../sitemap.json";

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
 * Get the sitemap for the host (note: a site can have multiple hosts)
 * @param {*} host
 * @returns
 */
function getSitemap(host) {
  console.log("getSitemap for", host);
  if (sitemap[host.toLowerCase()]) return sitemap[host.toLowerCase()].sitemap;
  let hostSitemap;
  const hosts = Object.keys(sitemap);

  let i = -1;
  while (i++ < hosts.length - 1 && !hostSitemap) {
    console.log("Looking for", `${i}/${hosts.length}`, hosts[i]);
    if (!sitemap[hosts[i]].hosts || sitemap[hosts[i]].hosts.length === 0)
      continue;

    const found = sitemap[hosts[i]].hosts.find((h) => h === host.toLowerCase());
    if (found) return sitemap[hosts[i]].sitemap;
  }
  console.error(`lib/getSitemap> Cannot find sitemap for host ${host}`);
  throw new Error(`host (${host}) not configured`);
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

  let pageInfo = hostSitemap[path ? path.toLowerCase() : "index"];
  if (!pageInfo) {
    // search by path
    Object.keys(hostSitemap).forEach((key) => {
      if (
        sitemap[key].googleDocId === path ||
        (sitemap[key].aliases &&
          sitemap[key].aliases.indexOf(path.toLowerCase()) !== -1)
      ) {
        pageInfo = sitemap[key];
        pageInfo.slug = key;
      }
    });
  }
  return pageInfo || {};
}
