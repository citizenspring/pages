import { getHostConfig, getPageMetadata } from "../lib/lib";

describe("lib.test.js", function () {
  test("getHostConfig", async function () {
    const config = await getHostConfig("citizenwallet.xyz");
    expect(config.title).toEqual("Citizen Wallet");
    const pageInfo = getPageMetadata(config, "index");
    // console.info(">>> pageInfo", pageInfo);
    expect(pageInfo.title).toEqual("Citizen Wallet");
    expect(pageInfo.path).toEqual("/");
    expect(pageInfo.slug).toEqual("index");
    expect(pageInfo.googleDocId).toEqual(
      "1mHwwebrTmk2u2Sxc7D8PmcTwwIaBGTrqeorltoB5VDc"
    );
  });
});
