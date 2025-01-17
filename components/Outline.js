import React, { useState } from "react";
import Link from "next/link";

function Outline({ className, websiteTitle, websiteIcon, outline, onChange }) {
  const [isActive, setActive] = useState(false);
  if (!outline || !outline.length || outline.length < 8) return null;

  function toggleMenu() {
    if (onChange) {
      onChange();
    }
    window.scrollTo(0, 0);
    setActive(!isActive);
  }
  return (
    <div id="outline" className={className}>
      <div
        className={`menu fixed z-30 top-0 left-0 bg-gray-100/90 dark:bg-gray-900`}
      >
        <button
          className="p-4 focus:outline-none active:bg-gray-300 dark:active:bg-gray-900 dark:text-white"
          onClick={() => toggleMenu()}
        >
          {!isActive && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 dark:invert"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
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
              className="h-6 w-6 dark:invert"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
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
        className={`sidebar text-black-800 left-0 transform bg-gray-100/90 dark:bg-gray-900
        w-full relative pb-2 mb-8
        ${isActive ? "" : "hidden sm:fixed sm:-translate-x-full"}
        transition duration-200 ease-in-out
        sm:pb-8 sm:pr-2
        md:fixed md:top-0 md:bottom-0
        md:overflow-hidden z-20 md:w-80
        `}
      >
        <div className="h-full overflow-y-auto pl-1 pb-8 md:absolute md:inset-0">
          <div className="sm:hidden absolute top-0 left-0 w-80 h-12"></div>
          <Link href="/" title="Back to homepage">
            <div className="pl-3 pt-6 flex">
              {websiteIcon && (
                <img
                  src={websiteIcon.src}
                  alt="favicon"
                  className="h-7 mt-8 ml-0 mr-2 icon"
                />
              )}
              <h2 className="dark:text-gray-50">{websiteTitle}</h2>
            </div>
          </Link>
          <h3 className="pl-3 pt-0 dark:text-gray-50">On this page</h3>
          <div className="h-[calc(100vh-12.5rem)] overflow-y-auto">
            {outline
              .filter((item) => item.level > 0)
              .map((item, i) => {
                return (
                  <a
                    className="block rounded hover:bg-gray-200 dark:hover:bg-slate-300 mx-1"
                    href={`#${item.slug}`}
                    key={`${i}-${item.slug}`}
                  >
                    <div
                      className={`text-gray-800 dark:text-gray-50 dark:hover:text-gray-800 ${
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
      </div>
      {/* <div
        className={`hidden md:block xl:hidden relative transition width duration-800 ease-in-out ${
          isActive ? "w-80" : "w-0"
        }  sidebarunder z-10 h-screen`}
      ></div> */}
    </div>
  );
}

export default Outline;
