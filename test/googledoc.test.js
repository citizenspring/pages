import fs from "fs";
const {
  fetchGoogleDoc,
  extractMetadata,
  proxyImage,
  getHTMLFromGoogleDocId,
} = require("../lib/googledoc");

import metadata from "./snapshots/metadata.json";
import images from "./snapshots/images.json";

const docbody = fs.readFileSync("./test/snapshots/docbody.html", "utf8");
const googleDocId = "1tnZ8suW7GJWtqc4peaILo9XhaxwAFie7crBPUlofPo8";

describe("googledoc lib", function () {
  test("extract title, sitemap, redirections from a google doc", async function () {
    const data = extractMetadata(await fetchGoogleDoc(googleDocId));
    expect(data.title).toEqual("DAO.Brussels");
    expect(data.sitemap).toEqual(metadata.sitemap);
    expect(data.redirections).toEqual(metadata.redirections);
  });

  test("extract content from a google doc", async function () {
    const doc = await getHTMLFromGoogleDocId(googleDocId, {
      sitemap: metadata.sitemap,
    });
    expect(doc.title).toEqual("DAO.Brussels");
    expect(doc.description).toEqual(
      "Brussels as a Decentralized Autonomous Organization"
    );
    expect(doc.images.length).toEqual(images.length);
    expect(doc.images[0].md5).toEqual(images[0].md5);
    expect(doc.images[0].width).toEqual(images[0].width);
    expect(doc.images[0].height).toEqual(images[0].height);
  });
  test("extract metadata from a google doc html", async function () {
    const { title, description, sitemap, icon } = await extractMetadata(
      docbody
    );
    expect(title).toEqual("Xavier Damman");
    expect(description).toEqual("Citizen, dad, entrepreneur, regen.");
    expect(icon.src).toEqual(
      "/api/image?googleDocId=1GbUmVMiGBLu6EcQRhLlUi8B_p8OrnxS_AIAXwiogbXs&imageHash=a4896d8906838dc73e41dcceb196281c"
    );
    expect(Object.keys(sitemap).length).toEqual(10);
  });
});
