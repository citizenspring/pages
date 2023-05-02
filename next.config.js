const subdomainsRedirections = {
  "citizenwallet.xyz": {
    signal:
      "https://signal.group/#CjQKIK7lRZGN89uFUJqZ31npeVKbVHfo5Z15yl9XFoAeh2OrEhDfnmWNlW98l-OpBKzAnPET",
    drive: "https://drive.google.com/open?id=16fm3DNfOsL7HJ_uz4DuL9krNRh72YoRS",
    miro: "http://miro.com/app/board/uXjVMd0Js_E=/",
  },
  "citizencorner.brussels": {
    calendar:
      "https://calendar.google.com/calendar/embed?src=apc0sg19i1ic703d5g1d53tpss%40group.calendar.google.com&ctz=Europe%2FBrussels",
    drive:
      "https://drive.google.com/drive/folders/10F8oO59nZo_Yja8Fz8utGDinCuB8VQe8?usp=sharing",
    facebook: "https://facebook.com/citizencornerbxl",
    donate: "https://opencollective.com/citizencorner/donate",
    map: "https://goo.gl/maps/jXiHm57z77CLxURh8",
    budget: "https://opencollective.com/citizencorner",
    discord: "https://discord.gg/xyxQhRft8x",
    whatsapp: "https://chat.whatsapp.com/GWPZyBseJalHomDjIFu1sm",
  },
  "citizenspring.earth": {
    drive:
      "https://drive.google.com/drive/u/0/folders/1ooAOhv3OGXAforyuYUA9i2B0kb1uP471",
  },
  "dao.brussels": {
    drive:
      "https://drive.google.com/drive/folders/1r3kSwu8_w4ju0fn5TQOhg7HCQW2XwnmH",
    discord: "https://discord.gg/awfSTf6EHK",
    whatsapp: "https://chat.whatsapp.com/JQ4fttn0KEH79xAyryYs4e",
    zoom: "https://us02web.zoom.us/j/6025635806",
    telegram: "https://t.me/joinchat/5NbP0-Vl5Vg3MTgx",
    calendar:
      "https://calendar.google.com/calendar/embed?src=haijn9je0u2ci9efj7g0it8tk4%40group.calendar.google.com&ctz=Europe%2FBrussels",
  },
  "regensunite.earth": {
    notion: "https://notion.so/regensunite",
    drive:
      "https://drive.google.com/drive/u/0/folders/10MMk0j6A1cMOSDIRdWxv0FCSwHXg7sAE",
    calendar:
      "https://calendar.google.com/calendar/embed?src=729ti6j2pin4og5kmbsr7ich78%40group.calendar.google.com&ctz=Europe%2FBrussels",
    apply:
      "https://jz04xmgcexm.typeform.com/to/HQxBKQdg?typeform-source=apply.regensunite.earth",
    discord: "https://discord.gg/QcfPAJaWb2",
    bogota: "https://regensunite.co/bogota",
    zoom: "https://us02web.zoom.us/j/6025635806",
    brussels: "https://www.regensunite.earth/event/regens-unite-brussels-2023",
  },
  "allforclimate.earth": {
    drive:
      "https://drive.google.com/drive/u/0/folders/1g14Qyf_DmvGuevk4Ks5NgfkWPN5V6H6O",
    zoom: "https://us02web.zoom.us/j/6025635806",
    join: "https://jz04xmgcexm.typeform.com/to/lPbcL9nj?typeform-source=join.allforclimate.earth",
    dework: "https://dework.xyz/o/all-for-clim-5YSFCGX71LR0qVyvqsL2w5",
    bounties: "https://dework.xyz/o/all-for-clim-5YSFCGX71LR0qVyvqsL2w5",
    tasks: "https://dework.xyz/o/all-for-clim-5YSFCGX71LR0qVyvqsL2w5",
    projects: "https://dework.xyz/o/all-for-clim-5YSFCGX71LR0qVyvqsL2w5",
    calendar:
      "https://calendar.google.com/calendar/u/0/embed?src=c_kcbdb0ulem2nivoiugvfbmhjb8@group.calendar.google.com",
    discord: "https://discord.gg/7Cb6Nf2MgM",
  },
};

module.exports = {
  env: {
    OC_GRAPHQL_API: "https://api.opencollective.com/graphql/v1/",
    OC_GRAPHQL_API_V2: "https://api.opencollective.com/graphql/v2/",
  },
  swcMinify: false,
  images: {
    domains: [
      "lh1.googleusercontent.com",
      "lh2.googleusercontent.com",
      "lh3.googleusercontent.com",
      "lh4.googleusercontent.com",
      "lh5.googleusercontent.com",
      "lh6.googleusercontent.com",
      "dl.airtable.com",
      "pbs.twimg.com",
    ],
  },
  async redirects() {
    const domains = Object.keys(subdomainsRedirections);
    const redirections = [];
    domains.forEach((domain) => {
      console.log("\nRedirections for", domain);
      const subdomains = Object.keys(subdomainsRedirections[domain]);
      subdomains.forEach((subdomain) => {
        console.log(
          `> ${subdomain}.${domain} -> ${subdomainsRedirections[domain][subdomain]}`
        );
        redirections.push({
          source: "/(.*)",
          has: [
            {
              type: "host",
              value: `${subdomain}.${domain}`,
            },
          ],
          permanent: false,
          destination: subdomainsRedirections[domain][subdomain],
        });
      });
    });
    return redirections;
  },
  async rewrites() {
    return [
      {
        has: [
          {
            type: "host",
            value: "(?<host>.*)",
          },
        ],
        source: "/",
        destination: "/:host",
      },
      {
        has: [
          {
            type: "host",
            value: "(?<host>.*)",
          },
        ],
        source: "/:path*",
        destination: "/:host/:path*",
      },
    ];
  },
};
