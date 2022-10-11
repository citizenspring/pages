const ErrorNotPublished = ({ googleDocId }) => (
  <div className="mx-auto w-4/6">
    <h2>This Google Doc hasn't been published yet by the author</h2>
    <p>
      <a
        href={`https://docs.google.com/document/d/${googleDocId}/edit`}
        target="_blank"
      >
        Open the document
      </a>{" "}
      then go to the file menu and click on "Publish to the web".
    </p>
  </div>
);

export default ErrorNotPublished;
