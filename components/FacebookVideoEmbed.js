export default ({ videoUrl }) => {
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
          border: "none",
          overflow: "hidden",
        }}
        src={`https://www.facebook.com/plugins/video.php?height=314&href=${videoUrl}&show_text=false&width=560&t=0`}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};
