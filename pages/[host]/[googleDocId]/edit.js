import { getPageMetadata } from "../../../lib/lib";

export async function getServerSideProps({ params }) {
  const pageInfo = getPageMetadata(params.host, params.googleDocId);
  const googleDocId = pageInfo.googleDocId || params.googleDocId;

  return {
    redirect: {
      destination: `https://docs.google.com/document/d/${googleDocId}/edit`,
    },
  };
}

export default function Edit() {
  return <div>Redirecting...</div>;
}
