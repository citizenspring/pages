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
