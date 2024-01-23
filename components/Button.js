import React from "react";

export default ({ children, href, primary }) => {
  return (
    <a href={href}>
      <button
        className={primary ? "button primary" : "button secondary"}
        href={href}
      >
        {children}
      </button>
    </a>
  );
};
