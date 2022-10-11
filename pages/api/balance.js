import { GraphQLClient, gql } from "graphql-request";
import AbortController from "abort-controller";

const query = gql`
  query getCollectiveStats($collectiveSlug: String!) {
    Collective(slug: $collectiveSlug) {
      currency
      stats {
        balance
      }
    }
  }
`;

const getOpenCollectiveBalance = async (collectiveSlug) => {
  if (!collectiveSlug) throw new Error("Missing collectiveSlug");

  const slugParts = collectiveSlug.split("/");
  const slug = slugParts[slugParts.length - 1];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 3000);
  const graphQLClient = new GraphQLClient(process.env.OC_GRAPHQL_API, {
    signal: controller.signal,
  });
  const data = await graphQLClient.request(query, { collectiveSlug: slug });
  const result = {
    token: data.Collective.currency,
    result: `${data.Collective.stats.balance}`,
  };
  return result;
};

const tokenContractAddresses = {
  ethereum: {
    WETH: {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
    },
    DAI: {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
    },
    USDC: {
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      decimals: 6,
    },
    USDT: {
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      decimals: 6,
    },
    MATIC: {
      address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
      decimals: 18,
    },
  },
  polygon: {
    WETH: {
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
    },
    DAI: {
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      decimals: 18,
    },
    USDC: {
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
    },
    USDT: {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
    },
    MATIC: {
      address: "0x0000000000000000000000000000000000001010",
      decimals: 18,
    },
  },
};

const apihosts = {
  ethereum: `https://api.etherscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY}`,
  polygon: `https://api.polygonscan.com/api?apikey=${process.env.POLYGONSCAN_API_KEY}`,
};

const api_endpoint = (chain, address, token) => {
  const apihost = apihosts[chain || "ethereum"];

  if (!token)
    return `${apihost}&module=account&action=balance&address=${address}&tag=latest`;

  return `${apihost}&module=account&action=tokenbalance&contractaddress=${
    tokenContractAddresses[chain || "ethereum"][token].address
  }&address=${address}&tag=latest`;
};

export default async (req, res) => {
  if (!req.query.address) {
    return res.status(200).json({ error: "no address provided" });
  }
  const chain = req.query.chain || "ethereum";
  const token = req.query.token || "ether";

  let decimals = 18;
  let data;
  if (chain === "opencollective") {
    decimals = 2;
    data = await getOpenCollectiveBalance(req.query.address);
  } else {
    const apicall = api_endpoint(chain, req.query.address, req.query.token);
    data = await fetch(apicall).then((res) => res.json());
    decimals = tokenContractAddresses[chain][token].decimals;
  }

  // console.log("api/balance: data received", data);

  const result = {
    chain,
    address: req.query.address,
    balance: data.result,
    token,
  };

  if (result.balance != "0" && decimals != 18) {
    for (let i = 0; i < 18 - decimals; i++) {
      result.balance += "0";
    }
  }

  if (data.message === "OK") {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=1200"
    );
  }

  res.status(200).json(result);
};
