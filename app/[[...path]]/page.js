import Head from "next/head";
// import { getHTMLFromGoogleDocId } from "../../lib/googledoc";
import { getPageMetadata, absoluteUrl, imageType } from "../../lib/lib";
import sitemap from "../../sitemap.json";

export async function generateMetadata({ params, searchParams }, parent) {
  // console.log(">>> params", params);
  // console.log(">>> searchParams", searchParams);

  // read route params
  const id = params.host;

  const pageInfo = getPageMetadata(host);

  return {
    title: title || defaultValues.title,
    description: description || defaultValues.description,
    image: absoluteUrl(image || defaultValues.image),
    imageType: imageType(image || defaultValues.image),
    favicon: favicon || defaultValues.favicon,
    openGraph: {
      images: [absoluteUrl(image || defaultValues.image)],
    },
  };
}

export default function Page({ params, searchParams }) {
  return "hello world";
}
