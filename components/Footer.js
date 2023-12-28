import Link from "next/link";

const Footer = ({ googleDocId, sitemap }) => {
  let homeTitle = "Home";
  let homeIcon;
  // const sections = { "index" : { title: "Home", href: "/", pages: [] }, "contribute": { title: "Contribute", pages: [] } };
  const columns = {
    index: { pages: [] },
  };
  for (const key in sitemap) {
    const page = sitemap[key];
    if (page.hidden) continue;
    if (key === "index") continue;
    if (key === "edit") continue;
    if (key === "contribute") {
      columns[key] = { title: key, pages: [] };
    }
    if (key.indexOf("/") !== -1) {
      const subtitle = key.substring(0, key.indexOf("/"));
      columns[subtitle] = { title: subtitle, pages: [] };
    }
  }

  for (const key in sitemap) {
    const page = sitemap[key];
    if (page.hidden) continue;
    if (key === "edit") continue;
    if (page.redirect) {
      page.href = page.redirect;
    } else {
      page.href = `/${key === "index" ? "" : key}`;
    }
    if (columns[key]) {
      if (key === "index") {
        homeTitle = page.title;
        homeIcon = page.svgicon || page.icon || page.favicon;
        columns[key].title = "Home";
      } else {
        columns[key].title = page.title;
      }
      columns[key].icon = page.svgicon || page.icon || page.favicon;
      columns[key].href = page.href;
    } else if (key.indexOf("/") !== -1) {
      const subtitle = key.substring(0, key.indexOf("/"));
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
  console.log(">>> footer", columns);

  return (
    <footer
      id="footer"
      className="bg-gray-800 text-white mt-12 py-12 px-6 md:px-12 lg:px-24 w-full"
    >
      <div className="container max-w-[1024px] mx-auto flex flex-col sm:flex-row justify-around">
        <a href="/" title={`${homeTitle} homepage`}>
          <div className="space-y-4 mb-8 mr-10 min-w-[164px]">
            {columns.index.icon && (
              <img
                src={columns.index.icon}
                id="footerIcon"
                alt={`${homeTitle} icon`}
                className="icon h-10 mx-0"
              />
            )}
            {!columns.index.icon && <span>🏠</span>}

            <h1 className="text-2xl font-semibold">{homeTitle}</h1>
          </div>
        </a>
        <div className="flex flex-wrap flex-col sm:flex-row">
          {Object.keys(columns)
            .filter(
              (c) =>
                columns[c].pages &&
                columns[c].pages.length > 0 &&
                columns[c].title.length < 30
            )
            .map((colName) => (
              <div className="space-y-4 mb-8 min-w-[164px] max-w-[196px] ml-0 mr-8">
                <h2 className="text-lg mt-0 font-semibold capitalize">
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
                    <li className="list-none ml-0 normal-case">
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
    </footer>
  );
};

export default Footer;
