import React from "react";

export default ({ id }) => {
  return (
    <div
      className="video full-width"
      style={{
        position: "relative",
        paddingBottom: "56.42633228840126%",
        height: 0,
      }}
    >
      <iframe
        src={`https://www.loom.com/embed/${id}`}
        frameBorder="0"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></iframe>
    </div>
  );
};
