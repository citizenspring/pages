module.exports = {
  plugins: [
    // "tailwindcss/nesting",
    "tailwindcss",
    [
      "@fullhuman/postcss-purgecss",
      process.env.NODE_ENV === "production"
        ? {
            // the paths to all template files
            content: [
              "./pages/**/*.{js,jsx,ts,tsx}",
              "./components/**/*.{js,jsx,ts,tsx}",
            ],
            // function used to extract class names from the templates
            defaultExtractor: (content) => {
              const arr = content.match(/[\w-/:]+(?<!:)/g) || [];
              arr.push(
                "ul",
                "li",
                "pagebreak",
                "p",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6"
              );
              return arr;
            },
          }
        : false,
    ],
  ],
};
