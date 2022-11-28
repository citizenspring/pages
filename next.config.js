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
    return [
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "drive.citizencorner.brussels",
          },
        ],
        permanent: false,
        destination:
          "https://drive.google.com/drive/folders/10F8oO59nZo_Yja8Fz8utGDinCuB8VQe8?usp=sharing",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "calendar.citizencorner.brussels",
          },
        ],
        permanent: false,
        destination:
          "https://calendar.google.com/calendar/embed?src=apc0sg19i1ic703d5g1d53tpss%40group.calendar.google.com&ctz=Europe%2FBrussels",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "facebook.citizencorner.brussels",
          },
        ],
        permanent: false,
        destination: "https://facebook.com/citizencornerbxl",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "group.citizencorner.brussels",
          },
        ],
        permanent: false,
        destination: "https://facebook.com/groups/citizencorner",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "map.citizencorner.brussels",
          },
        ],
        permanent: false,
        destination: "https://goo.gl/maps/jXiHm57z77CLxURh8",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "donate.citizencorner.brussels",
          },
        ],
        permanent: false,
        destination: "https://opencollective.com/citizencorner/donate",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "budget.citizencorner.brussels",
          },
        ],
        permanent: false,
        destination: "https://opencollective.com/citizencorner",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "discord.citizencorner.brussels",
          },
        ],
        permanent: false,
        destination: "https://discord.gg/xyxQhRft8x",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "drive.citizenspring.earth",
          },
        ],
        permanent: false,
        destination:
          "https://drive.google.com/drive/u/0/folders/1ooAOhv3OGXAforyuYUA9i2B0kb1uP471",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "drive.dao.brussels",
          },
        ],
        permanent: false,
        destination:
          "https://drive.google.com/drive/folders/1r3kSwu8_w4ju0fn5TQOhg7HCQW2XwnmH",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "discord.dao.brussels",
          },
        ],
        permanent: false,
        destination: "https://discord.gg/awfSTf6EHK",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "youtube.dao.brussels",
          },
        ],
        permanent: false,
        destination: "https://www.youtube.com/channel/UClgbKT6NhY2Au6xn_TquBYg",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "calendar.dao.brussels",
          },
        ],
        permanent: false,
        destination:
          "https://calendar.google.com/calendar/embed?src=haijn9je0u2ci9efj7g0it8tk4%40group.calendar.google.com&ctz=Europe%2FBrussels",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "zoom.dao.brussels",
          },
        ],
        permanent: false,
        destination: "https://us02web.zoom.us/j/6025635806",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "telegram.dao.brussels",
          },
        ],
        permanent: false,
        destination: "https://t.me/joinchat/5NbP0-Vl5Vg3MTgx",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "drive.regensunite.earth",
          },
        ],
        permanent: false,
        destination:
          "https://drive.google.com/drive/u/0/folders/10MMk0j6A1cMOSDIRdWxv0FCSwHXg7sAE",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "calendar.regensunite.earth",
          },
        ],
        permanent: false,
        destination:
          "https://calendar.google.com/calendar/embed?src=59a5f6d5973c6a0836aec1ad3603090ac9b9c5ed46bbde8b01a06be34959c864%40group.calendar.google.com&ctz=Europe%2FBrussels",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "apply.regensunite.earth",
          },
        ],
        permanent: false,
        destination:
          "https://jz04xmgcexm.typeform.com/to/HQxBKQdg?typeform-source=apply.regensunite.earth",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "zoom.regensunite.earth",
          },
        ],
        permanent: false,
        destination: "https://us02web.zoom.us/j/6025635806",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "calendar.regensunite.earth",
          },
        ],
        permanent: false,
        destination:
          "https://calendar.google.com/calendar/embed?src=729ti6j2pin4og5kmbsr7ich78%40group.calendar.google.com&ctz=Europe%2FBrussels",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "discord.regensunite.earth",
          },
        ],
        permanent: false,
        destination: "https://discord.gg/QcfPAJaWb2",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "bogota.regensunite.earth",
          },
        ],
        permanent: false,
        destination: "https://regensunite.co/bogota",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "drive.allforclimate.earth",
          },
        ],
        permanent: false,
        destination:
          "https://drive.google.com/drive/u/0/folders/1g14Qyf_DmvGuevk4Ks5NgfkWPN5V6H6O",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "join.allforclimate.earth",
          },
        ],
        permanent: false,
        destination:
          "https://jz04xmgcexm.typeform.com/to/lPbcL9nj?typeform-source=join.allforclimate.earth",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "zoom.allforclimate.earth",
          },
        ],
        permanent: false,
        destination: "https://us02web.zoom.us/j/6025635806",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "dework.allforclimate.earth",
          },
        ],
        permanent: false,
        destination: "https://dework.xyz/o/all-for-clim-5YSFCGX71LR0qVyvqsL2w5",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "bounties.allforclimate.earth",
          },
        ],
        permanent: false,
        destination: "https://dework.xyz/o/all-for-clim-5YSFCGX71LR0qVyvqsL2w5",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "tasks.allforclimate.earth",
          },
        ],
        permanent: false,
        destination: "https://dework.xyz/o/all-for-clim-5YSFCGX71LR0qVyvqsL2w5",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "projects.allforclimate.earth",
          },
        ],
        permanent: false,
        destination: "https://dework.xyz/o/all-for-clim-5YSFCGX71LR0qVyvqsL2w5",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "calendar.allforclimate.earth",
          },
        ],
        permanent: false,
        destination:
          "https://calendar.google.com/calendar/u/0/embed?src=c_kcbdb0ulem2nivoiugvfbmhjb8@group.calendar.google.com",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "discord.allforclimate.earth",
          },
        ],
        permanent: false,
        destination: "https://discord.gg/7Cb6Nf2MgM",
      },
    ];
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
