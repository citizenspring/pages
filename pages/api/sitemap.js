import {
  fetchGoogleDoc,
  extractMetadata,
  proxyImage,
} from "../../lib/googledoc";

export default async (req, res) => {
  if (!req.query.googleDocId) {
    return res.status(200).json({ error: "no googleDocId provided" });
  }
  const googleDocId = req.query.googleDocId;
  console.log("Fetching googleDocId", googleDocId);

  const metadata = extractMetadata(await fetchGoogleDoc(googleDocId));
  const icon = await proxyImage(googleDocId, metadata.icon);
  const r = {
    title: metadata.title,
    sitemap: metadata.sitemap,
    redirections: metadata.redirections,
    icon,
    googleDocId,
  };

  res.status(200).json(r);
};
