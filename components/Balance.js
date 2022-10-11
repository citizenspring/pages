import React from "react";
import useSWR from "swr";
import { formatUnits } from "@ethersproject/units";

/*
 * Address is in the gnosis format:
 * chain:address/token
 * e.g.:
 * - polygon:0x371cA2c8f1D02864C7306e5E5Ed5DC6edF2DD19c/DAI
 * - opencollective:regensunite/EUR
 */
const api_endpoint = (chain, address, token) => {
  const matches = address.match(/([a-z]+):([^\s]+)(?:\/)([A-Z]{3,5})?$/i);
  if (matches) {
    const [, _chain, _address, _token] = matches;
    return `/api/balance?chain=${_chain}&address=${_address}&token=${_token}`;
  }
  return `/api/balance?chain=${chain}&address=${address}&token=${token}`;
};

function BalanceWidget({ chain, address, token }) {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const apicall = api_endpoint(chain, address, token);
  console.log(">>> api call", apicall);
  const { data, error } = useSWR(apicall, fetcher);

  if (error) return "An error has occurred.";
  if (!data) return "Loading...";

  console.log(">>> data received", data);

  if (isNaN(parseFloat(data.balance))) return "Invalid response";

  return (
    <div>
      <strong>
        {parseFloat(
          parseFloat(formatUnits(data.balance, 18)).toFixed(2)
        ).toLocaleString()}
      </strong>{" "}
      {data.token}
    </div>
  );
}

export default BalanceWidget;
