import Twitter from "twitter-v2";
import "dotenv";

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
});

export async function getTwitterUsers(
  usernames,
  fields = "username,name,profile_image_url"
) {
  const { data } = await client.get("users/by", {
    usernames,
    "user.fields": fields,
  });
  return data;
}
