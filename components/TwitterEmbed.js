export default ({ tweetUrl }) => {
  return (
    <div className="tweet" style={{ maxWidth: "560px", margin: "0 auto" }}>
      <blockquote className="twitter-tweet">
        <a href={`${tweetUrl}?ref_src=twsrc%5Etfw`}></a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js"></script>
    </div>
  );
};
