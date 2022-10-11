import useSWR from "swr";
import Image from "next/image";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function AvatarFromTwitter({ twitterUsername, size, className }) {
  const api_call = `/api/twitter/usernames?usernames=${twitterUsername}`;
  console.log(">>> calling api_call", api_call);
  const { data, error } = useSWR(api_call, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <Image
      className={className}
      src={data[0].profile_image_url.replace("_normal", "_400x400")}
      width="118"
      height="118"
    />
  );
}

export default AvatarFromTwitter;
