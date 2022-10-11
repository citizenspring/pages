import { GraphQLClient, gql } from "graphql-request";
import AbortController from "abort-controller";

// https://app.baseql.com/airtable/appulnqgYpwapNjOB

// const query = gql`
//   {
//     participants(status: "published") {
//       name
//       website
//       twitter
//       pronouns
//       organization
//       organizationWebsite
//       organizationTwitter
//       city
//       description
//       profilePicture
//       categories {
//         name
//       }
//     }
//   }
// `;

export default async (req, res) => {
  const base = req.query.base;
  if (!base) {
    return res.status(400).json({ error: "Missing base" });
  }
  if (base.length != 17) {
    return res.status(400).json({ error: "Invalid base" });
  }
  // console.log(">>> query", req.query.query);
  const query = gql`
    ${req.query.query}
  `;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 3000);
  const endpoint = `https://api.baseql.com/airtable/graphql/${base}`;
  const graphQLClient = new GraphQLClient(endpoint, {
    signal: controller.signal,
    headers: {
      authorization: `Bearer ${process.env.BASEQL_TOKEN}`,
    },
  });
  try {
    const result = await graphQLClient.request(query);
    // console.log(">>> result", result);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: e });
  }
};
