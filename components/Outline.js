import React, { useState } from "react";
import Link from "next/link";

function Outline({ homeTitle, homeIcon, outline, onChange }) {
  if (!outline || !outline.length || outline.length < 8) return null;
  const [isActive, setActive] = useState(false);

  function toggleMenu() {
    if (onChange) {
      onChange();
    }
    window.scrollTo(0, 0);
    setActive(!isActive);
  }

  return (
    <div id="outline">
      <div className={`menu fixed z-30 top-0 left-0 bg-gray-100/90`}>
        <button
          className="p-4 focus:outline-none active:bg-gray-300"
          onClick={() => toggleMenu()}
        >
          {!isActive && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
          {isActive && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          )}
        </button>
      </div>
      <div
        className={`sidebar overflow-auto bg-gray-100 text-black-800 left-0 transform 
        w-full relative pb-2 mb-8
        ${isActive ? "" : "hidden sm:fixed sm:-translate-x-full"}"} 
        transition duration-200 ease-in-out
        sm:pb-8 sm:pr-2
        md:fixed
        md:min-h-screen z-20 md:w-80
        `}
      >
        <div className="md:min-h-screen md:overflow-y-auto pl-1 pb-8">
          <div className="sm:hidden absolute top-0 left-0 w-80 bg-gray-100/90 h-12"></div>
          <Link href="/">
            <a title="Back to homepage">
              <div className="pl-3 pt-6 flex">
                {homeIcon && (
                  <img
                    src={homeIcon}
                    alt="favicon"
                    className="h-7 mt-8 ml-0 mr-2"
                  />
                )}
                <h2>{homeTitle}</h2>
              </div>
            </a>
          </Link>
          <h3 className="pl-3 pt-0">On this page</h3>
          {outline
            .filter((item) => item.level > 0)
            .map((item, i) => {
              return (
                <a
                  className="block rounded hover:bg-gray-200 transition duration-200"
                  href={`#${item.slug}`}
                  key={`${i}-${item.slug}`}
                >
                  <div
                    className={`text-gray-800 ${
                      (item.level == 1 && "ml-2 font-bold") ||
                      (item.level == 2 && "ml-4") ||
                      (item.level == 3 && "ml-6") ||
                      (item.level == 4 && "ml-8 text-sm py-0.5") ||
                      (item.level == 5 && "ml-10 text-sm") ||
                      (item.level == 6 && "ml-12 text-sm")
                    }  p-1`}
                  >
                    {item.title}
                  </div>
                </a>
              );
            })}
        </div>
      </div>
      <div
        className={`hidden md:block xl:hidden relative transition width duration-800 ease-in-out ${
          isActive ? "w-80" : "w-0"
        }  sidebarunder z-10 h-screen`}
      ></div>
    </div>
  );
}

export default Outline;
