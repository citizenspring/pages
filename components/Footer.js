const Footer = ({ googleDocId, homeTitle, homeIcon }) => (
  <div className="footer mt-8 flex flex-row justify-between items-center w-screen max-w-screen-md mx-auto p-3">
    <div>
      <a href="/" title={homeTitle}>
        <img src={homeIcon} alt={`${homeTitle} icon`} className="h-10 mx-0" />
      </a>
    </div>
    <div>
      <a
        href={`https://docs.google.com/document/d/${googleDocId}/edit`}
        target="_blank"
        className="text-gray-600"
      >
        Edit Page 📝
      </a>
    </div>
  </div>
);

export default Footer;
