import { GraphQLClient, gql } from "graphql-request";
import AbortController from "abort-controller";

const query = gql`
  query getCollectiveStats($collectiveSlug: String!) {
    Collective(slug: $collectiveSlug) {
      currency
      stats {
        balance
        balanceWithBlockedFunds
        backers {
          all
        }
        totalAmountReceived
        totalAmountSpent
      }
    }
  }
`;

export default async (req, res) => {
  const collectiveSlug = req.query.collectiveSlug;
  if (!collectiveSlug) {
    return res.status(400).json({ error: "Missing collectiveSlug" });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 3000);
  const endpoint = process.env.OC_GRAPHQL_API;
  const graphQLClient = new GraphQLClient(process.env.OC_GRAPHQL_API, {
    signal: controller.signal,
  });
  try {
    const data = await graphQLClient.request(query, { collectiveSlug });
    const result = {
      token: data.Collective.currency,
      balance: `${data.Collective.stats.balance}0000000000000000`,
    };
    console.log(">>> result", result);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: e });
  }
};
