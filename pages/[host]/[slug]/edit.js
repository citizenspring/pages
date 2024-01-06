import {
  isGoogleDocId,
  getHostConfig,
  getPageMetadata,
} from "../../../lib/lib";

export async function getServerSideProps({ params }) {
  const slug = params.slug;

  let googleDocId;

  if (isGoogleDocId(slug)) {
    googleDocId = slug;
  } else {
    const hostConfig = await getHostConfig(params.host);
    const pageInfo = getPageMetadata(hostConfig, params.slug);
    googleDocId = pageInfo.googleDocId;
  }

  return {
    redirect: {
      destination: `https://docs.google.com/document/d/${googleDocId}/edit`,
    },
  };
}

export default function Edit() {
  return <div>Redirecting...</div>;
}
