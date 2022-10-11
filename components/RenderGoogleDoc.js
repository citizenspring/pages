import React from "react";
import Image from "next/image";
import Airtable from "../components/Airtable";
import Balance from "../components/Balance";
import ReactHtmlParser from "html-react-parser";

export default function RenderGoogleDoc({ html }) {
  const scriptsLoaded = {};

  const options = {
    replace: (node) => {
      if (node.name === "script") {
        if (typeof document === "undefined") return;
        if (scriptsLoaded[node.attribs.src]) {
          console.log("Script", node.attribs.src, "already loaded");
          return;
        }
        scriptsLoaded[node.attribs.src] = true;
        var script = document.createElement("script");
        script.src = node.attribs.src;
        script.onload = function () {
          console.log("script loaded:", node.attribs.src);
        };
        document.head.appendChild(script);
      }
      if (node.type === "tag" && node.name === "airtable") {
        return <Airtable base={node.attribs.base} table={node.attribs.table} />;
      }
      if (node.type === "tag" && node.name === "balance") {
        return (
          <Balance
            chain={node.attribs.chain}
            address={node.attribs.address}
            token={node.attribs.token}
          />
        );
      }
      if (node.type === "tag" && node.name === "img") {
        return (
          <Image
            src={node.attribs.src}
            width={node.attribs.width}
            height={node.attribs.height}
            layout="responsive"
          />
        );
      }
    },
  };

  const reactDom = ReactHtmlParser(`<div>${html}</div>`, options);

  return <div>{reactDom}</div>;
}
