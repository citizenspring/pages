const {
  fetchGoogleDoc,
  extractMetadata,
  proxyImage,
  getHTMLFromGoogleDocId,
} = require("../lib/googledoc");

const googleDocId = "1tnZ8suW7GJWtqc4peaILo9XhaxwAFie7crBPUlofPo8";

const sitemap = {
  "/manifesto": {
    path: "/manifesto",
    title: "manifesto",
    href: "https://docs.google.com/document/u/0/d/13UuqYxiV1iyy9K4OfzCcQF7YjA00LG0rMYe-4fTKkF4/edit",
    googleDocId: "13UuqYxiV1iyy9K4OfzCcQF7YjA00LG0rMYe-4fTKkF4",
  },
  "/treasury": {
    path: "/treasury",
    title: "treasury",
    href: "https://docs.google.com/document/d/1RcKZ7e-67XFCFFDxqLbcCaQjTebd4rwBm4gTC_IXKsM",
    googleDocId: "1RcKZ7e-67XFCFFDxqLbcCaQjTebd4rwBm4gTC_IXKsM",
  },
  "/events": {
    path: "/events",
    title: "events",
    href: "https://docs.google.com/document/u/0/d/1x_VJ8nWebSyDkyCrph2WB8bm010iNMPeUZeME7As9-Y/edit",
    googleDocId: "1x_VJ8nWebSyDkyCrph2WB8bm010iNMPeUZeME7As9-Y",
  },
  "/events/cryptowednesday": {
    path: "/events/cryptowednesday",
    title: "Crypto Wednesday",
    href: "https://docs.google.com/document/d/1l6cTpDg2zl4bNZ9kHLaeHLXxd2fdb9CVv39LtFiRTjY/edit",
    googleDocId: "1l6cTpDg2zl4bNZ9kHLaeHLXxd2fdb9CVv39LtFiRTjY",
  },
  "/cryptowednesday": {
    hidden: true,
    path: "/cryptowednesday",
    title: "/events/cryptowednesday",
    redirect: "/events/cryptowednesday",
  },
  "/cryptowednesday/reports": {
    hidden: true,
    path: "/cryptowednesday/reports",
    title: "Crypto Wednesday Reports",
    href: "https://docs.google.com/document/u/0/d/1qYqFwiwRVwodObJRFupO-4ltLnhKKAYkWbr04taxf74/edit",
    googleDocId: "1qYqFwiwRVwodObJRFupO-4ltLnhKKAYkWbr04taxf74",
  },
  "/events/calendar": {
    path: "/events/calendar",
    title: "Calendar",
    href: "https://calendar.dao.brussels",
    redirect: "https://calendar.dao.brussels",
  },
  "/projects/zinne": {
    path: "/projects/zinne",
    title: "zinne",
    href: "https://docs.google.com/document/u/0/d/10wzxAkixYX5isDKotkVU8buhMxd6pcoFwgt-gAKfVOc/edit",
    googleDocId: "10wzxAkixYX5isDKotkVU8buhMxd6pcoFwgt-gAKfVOc",
  },
  "/projects/citizenwallet": {
    path: "/projects/citizenwallet",
    title: "Citizen Wallet",
    href: "https://citizenwallet.xyz",
    redirect: "https://citizenwallet.xyz",
  },
  "/zinne": {
    hidden: true,
    path: "/zinne",
    title: "/projects/zinne",
    redirect: "/projects/zinne",
  },
  "/projects/solarpunk-nft-contest": {
    path: "/projects/solarpunk-nft-contest",
    title: "NFT Solarpunk contest imagine.brussels",
    href: "https://docs.google.com/document/u/0/d/14moXm8QT99c_oQ8G2j6WT2YfrXPGaUKRSdsM6rjqsnk/edit",
    googleDocId: "14moXm8QT99c_oQ8G2j6WT2YfrXPGaUKRSdsM6rjqsnk",
  },
  "/about/faq": {
    path: "/about/faq",
    title: "faq",
    href: "https://docs.google.com/document/u/0/d/1q3u64wxqUpMNRR4QHdm8_i3a7otrcyAbKopqJoLQ9ag/edit",
    googleDocId: "1q3u64wxqUpMNRR4QHdm8_i3a7otrcyAbKopqJoLQ9ag",
  },
  "/faq": {
    hidden: true,
    path: "/faq",
    title: "/about/faq",
    redirect: "/about/faq",
  },
  "/about/glossary": {
    path: "/about/glossary",
    title: "glossary",
    href: "https://docs.google.com/document/u/0/d/1-Xc0KqVU2H6cjU7w6pSX35wiDtdjqxGUDLdc6Hyynuk/edit",
    googleDocId: "1-Xc0KqVU2H6cjU7w6pSX35wiDtdjqxGUDLdc6Hyynuk",
  },
  "/glossary": {
    hidden: true,
    path: "/glossary",
    title: "/about/glossary",
    redirect: "/about/glossary",
  },
};
const redirections = {
  "/cryptowednesday": "/events/cryptowednesday",
  "/events/calendar": "https://calendar.dao.brussels",
  "/projects/citizenwallet": "https://citizenwallet.xyz",
  "/zinne": "/projects/zinne",
  "/faq": "/about/faq",
  "/glossary": "/about/glossary",
};

describe("googledoc lib", function () {
  test("extract title, sitemap, redirections from a google doc", async function () {
    const metadata = extractMetadata(await fetchGoogleDoc(googleDocId));
    // console.log(">>> metadata", metadata.title, metadata.description);
    expect(metadata.title).toEqual("DAO.Brussels");
    expect(metadata.sitemap).toEqual(sitemap);
    expect(metadata.redirections).toEqual(redirections);
  });

  test("extract content from a google doc", async function () {
    const doc = await getHTMLFromGoogleDocId(googleDocId, { sitemap });
    // console.log(">>> doc", doc);
    expect(doc.title).toEqual("DAO.Brussels");
    expect(doc.description).toEqual(
      "Brussels as a Decentralized Autonomous Organization"
    );
  });
});
