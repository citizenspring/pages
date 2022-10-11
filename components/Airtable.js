import useSWR from "swr";
import ParticipantCard from "./ParticipantCard";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Airtable({ base, tables }) {
  const query = `
{
  participants(status: "published") {
    name
    website
    twitter
    pronouns
    organization
    organizationWebsite
    organizationTwitter
    city
    description
    favoriteBook
    profilePicture
    categories {
      name
      hashtag
    }
  }
}`;

  const api_call = `/api/airtable?base=${base}&tables=${tables}&query=${encodeURIComponent(
    query
  )}`;
  console.log(">>> calling api_call", api_call);
  const { data, error } = useSWR(api_call, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  console.log(">>> data received", data);
  return (
    <div
      role="list"
      aria-label="Behind the scenes People "
      className="mt-24 lg:flex md:flex sm:flex items-center xl:justify-between flex-wrap md:justify-around sm:justify-around lg:justify-around"
    >
      {data.participants &&
        data.participants.map((row, i) => (
          <ParticipantCard
            className="mr-1"
            key={`participant-${i}`}
            data={row}
          />
        ))}
    </div>
  );
}

// const Airtable = ({ base, table }) => (
//   <div base={base} table={table}>
//     AIRTABLE HERE {base} table:{table}
//   </div>
// );

export default Airtable;
