import React from "react";
import Head from "next/head";
import Script from "next/script";

import { imageType } from "../lib/lib.js";

export default function FullPageIframe({
  src,
  title,
  description,
  favicon,
  image,
}) {
  return (
    <html
      style={{
        margin: 0,
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <title>{title}</title>
        <link rel="icon" href={favicon} />
        <meta
          property="og:description"
          name="description"
          content={description}
        />
        <meta property="og:image" content={image} />
        <meta property="og:image:type" content={imageType(image)} />
      </Head>
      <Script src="https://tally.so/widgets/embed.js" />
      <body>
        <iframe
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            border: 0,
          }}
          data-tally-src={`${src}?transparentBackground=1`}
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title={title}
        ></iframe>
      </body>
    </html>
  );
}
