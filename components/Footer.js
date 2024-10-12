import React from "react";
import Link from "next/link";

const Footer = ({ googleDocId, sitemap, websiteTitle, websiteIcon }) => {
  const columns = {
    index: {
      pages: [],
      icon: websiteIcon && websiteIcon.src,
      title: "Home",
    },
  };
  for (const path in sitemap) {
    const page = sitemap[path];
    const slug = page.slug || path.substring(1);
    if (page.hidden) continue;
    if (slug === "index") continue;
    if (slug === "edit") continue;
    if (slug === "contribute") {
      columns[slug] = { title: slug, pages: [] };
    }
    if (slug.indexOf("/") !== -1) {
      const subtitle = slug.substring(0, slug.indexOf("/"));
      columns[subtitle] = { title: subtitle.replace(/[_\-]/g, " "), pages: [] };
    }
  }

  for (const path in sitemap) {
    const page = sitemap[path];
    const slug = page.slug || path.substring(1);
    if (page.hidden) continue;
    if (slug === "edit") continue;
    if (page.redirect) {
      page.href = page.redirect;
    } else {
      page.href = `/${slug === "index" ? "" : slug}`;
    }
    if (columns[slug]) {
      if (slug === "index") {
        // websiteTitle = page.title;
        // websiteIcon = { src: page.svgicon || page.icon || page.favicon };
        columns["index"].title = "Home" || page.title || websiteTitle || "Home";
        columns["index"].googleDocId = page.googleDocId;
      } else {
        columns[slug].title = page.title;
      }
      columns[slug].icon =
        page.svgicon ||
        page.icon ||
        page.favicon ||
        (websiteIcon && websiteIcon.src);
      columns[slug].href = page.href;
    } else if (slug.indexOf("/") !== -1) {
      const subtitle = slug.substring(0, slug.indexOf("/"));
      columns[subtitle].pages.push(page);
    } else {
      columns["index"].pages.push(page);
    }
  }
  columns["contribute"] = columns["contribute"] || {
    title: (sitemap.edit && sitemap.edit.title) || "Contribute",
    pages: [],
  };
  columns["contribute"].pages.push({
    title: (sitemap.edit && sitemap.edit.description) || "Edit this page",
    href: `https://docs.google.com/document/d/${googleDocId}/edit`,
  });
  if (googleDocId !== columns["index"].googleDocId) {
    columns["contribute"].pages.push({
      title: (sitemap.edit && sitemap.edit.description) || "Edit this website",
      href: `https://docs.google.com/document/d/${columns["index"].googleDocId}/edit`,
    });
  }

  return (
    <div
      id="footer"
      className="bg-gray-800 dark:bg-black text-white mt-12 py-12 px-6 md:px-12 lg:px-24 w-full"
    >
      <div className="container max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-around">
        <a href="/" title={`${websiteTitle} homepage`}>
          <div className="space-y-4 mb-8 mr-10 min-w-[164px]">
            {websiteIcon && (
              <img
                src={websiteIcon.src}
                id="footerIcon"
                alt={`${websiteTitle} icon`}
                className="icon h-10 mx-0"
              />
            )}
            {!websiteIcon && <span>🏠</span>}

            <h1 className="text-xl font-semibold">{websiteTitle}</h1>
          </div>
        </a>
        <div className="flex flex-wrap flex-col sm:flex-row">
          {Object.keys(columns)
            .filter(
              (c) =>
                columns[c].pages &&
                columns[c].pages.length > 0 &&
                columns[c].title &&
                columns[c].title.length < 30
            )
            .map((colName) => (
              <div
                key={`footer-${colName}`}
                className="space-y-4 mb-8 min-w-[128px] max-w-[196px] ml-0 mr-8"
              >
                <h2 className="mt-0 font-semibold capitalize text-base">
                  {columns[colName].href && (
                    <Link
                      className="hover:underline "
                      href={columns[colName].href}
                    >
                      {columns[colName].title}
                    </Link>
                  )}
                  {!columns[colName].href && <>{columns[colName].title}</>}
                </h2>
                <ul className="space-y-2 list-none">
                  {columns[colName].pages.map((page) => (
                    <li
                      key={`footer-${page.slug}`}
                      className="list-none ml-0 normal-case text-sm"
                    >
                      <Link className="hover:underline " href={page.href}>
                        {page.title || page.slug}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
