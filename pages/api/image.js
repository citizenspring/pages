import crypto from "crypto";

// We proxy images because Google Docs returns different image urls for the same image
// resulting in NextImage considering every image as a unique one and not caching them

export default async (req, res) => {
  if (!req.query.googleDocId) {
    res.status(200).json({ error: "no googleDocId provided" });
    return;
  }
  if (!req.query.imageHash) {
    res.status(200).json({ error: "no imageHash provided" });
    return;
  }

  const googledocURL = `https://docs.google.com/document/d/${req.query.googleDocId}`;
  let fetchResponse;
  try {
    // console.log(">>> fetching", googledocURL);
    fetchResponse = await fetch(`${googledocURL}/pub`);
    if (fetchResponse.status !== 200) {
      res
        .status(fetchResponse.status)
        .json({ error: fetchResponse.statusText });
      return;
    }
  } catch (e) {
    console.log(
      "!!! getHTMLFromGoogleDocId > cannot fetch",
      `${googledoc}/pub`,
      e
    );
    res.status(500).json({ error: e.message });
    return;
  }

  const htmlText = await fetchResponse.text();
  const regex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  let match;
  const matches = [];
  while ((match = regex.exec(htmlText)) !== null) {
    matches.push(match[1]); // Extract the src attribute value
    let img;
    try {
      img = await fetchImage(match[1]);
    } catch (e) {
      console.error("!!! /api/image > fetchImage error", e);
    }
    if (img.md5 === req.query.imageHash) {
      // console.log(">>> image found", img);
      const oneYearInSeconds = 31536000;
      res.setHeader("Cache-Control", `public, max-age=${oneYearInSeconds}`);
      res.setHeader("Content-Type", img.filetype); // Adjust the content type as needed
      res.setHeader("Content-Length", img.filesize); // Adjust the content type as needed
      res.status(200).end(img.buffer);
      return;
    }
  }
  res.status(404).end();
};

async function fetchImage(src) {
  // console.log(">>> fetching", src);
  const response = await fetch(src);
  if (response.status !== 200) {
    console.error("!!! fetchImage > fetch error", response.status, response);
    return {};
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  // console.log(">>> response.headers", response.headers);
  const md5 = crypto.createHash("md5").update(buffer).digest("hex");
  const filesize = response.headers.get("content-length");
  const filetype = response.headers.get("content-type");
  return {
    src,
    md5,
    filesize,
    filetype,
    buffer,
  };
}
