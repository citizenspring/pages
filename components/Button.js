const primaryClasses =
  "inline-block px-7 py-3 bg-green-500 text-white font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out";
const secondaryClasses =
  "inline-block px-7 py-3 border-2 border-green-500 text-green-500 font-medium text-sm leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out";

export default ({ children, href, primary }) => {
  return (
    <a href={href}>
      <button
        className={primary ? primaryClasses : secondaryClasses}
        href={href}
      >
        {children}
      </button>
    </a>
  );
};
