import * as twitter from "../../../lib/twitter";

export default async (req, res) => {
  if (!req.query.usernames) {
    return res.status(200).json({ error: "no usernames provided" });
  }
  console.log("Fetching Twitter user details for", req.query.usernames);
  const data = await twitter.getTwitterUsers(req.query.usernames);
  res.status(200).json(data);
};
