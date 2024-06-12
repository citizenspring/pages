import React from "react";

export default ({ params }) => {
  if (!params) return null;
  const urlParams = new URLSearchParams(params);
  const src = urlParams.get("src");
  const ctz = urlParams.get("ctz");
  if (!src) return null;
  return (
    <div
      className="iframe calendar full-width"
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
          borderWidth: 0,
        }}
        src={`https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=${ctz}&showCalendars=0&showTabs=0&mode=AGENDA&showNav=0&showDate=0&showPrint=0&showTz=0&showTitle=0&src=${src}&color=%2315803c`}
        frameBorder="0"
        width="800"
        height="600"
      />
    </div>
  );
};
