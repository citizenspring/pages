export default ({ id }) => {
  return (
    <div
      className="video full-width"
      style={{
        position: "relative",
        paddingBottom: "56.25%" /* 16:9 */,
        paddingTop: 0.25,
        height: 0,
      }}
    >
      <iframe
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        src={`https://player.vimeo.com/video/${id}?h=329838e33e&title=0&byline=0&portrait=0`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
