export default ({ revueUrl, askName }) => {
  return (
    <div id="revue-embed" className="flex justify-center my-8 ">
      <div className="max-w-xl p-4 bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="mt-0 mb-3 text-xl font-medium text-gray-900 dark:text-white">
          Subscribe to our newsletter
        </h3>
        <form
          action={`${revueUrl}/add_subscriber`}
          method="post"
          id="revue-form"
          name="revue-form"
          target="_blank"
        >
          <div className="flex items-end mb-3">
            <div className="relative mr-3 w-full revue-form-group">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </div>

              <input
                className="revue-form-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 sm:p-3 sm:pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Your email address..."
                type="email"
                name="member[email]"
                id="member_email"
              />
            </div>
            {askName && (
              <div>
                <div className="revue-form-group mb-6">
                  <label
                    for="member_first_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    First name{" "}
                    <span className="optional text-sm text-gray-500">
                      (Optional)
                    </span>
                  </label>
                  <input
                    className="revue-form-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 sm:p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="First name... (Optional)"
                    type="text"
                    name="member[first_name]"
                    id="member_first_name"
                  />
                </div>
                <div className="revue-form-group mb-6">
                  <label
                    for="member_last_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Last name{" "}
                    <span className="optional text-sm text-gray-500">
                      (Optional)
                    </span>
                  </label>
                  <input
                    className="revue-form-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 sm:p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Last name... (Optional)"
                    type="text"
                    name="member[last_name]"
                    id="member_last_name"
                  />
                </div>
              </div>
            )}

            <div className="revue-form-actions">
              <input
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="submit"
                value="Subscribe"
                name="member[subscribe]"
                id="member_submit"
              />
            </div>
          </div>
          <div className="text-sm font-medium text-gray-500 revue-form-footer dark:text-gray-300">
            By subscribing, you agree with Revue’s{" "}
            <a target="_blank" href="https://www.getrevue.co/terms">
              Terms of Service
            </a>{" "}
            and{" "}
            <a target="_blank" href="https://www.getrevue.co/privacy">
              Privacy Policy
            </a>
            .
          </div>
        </form>
      </div>
    </div>
  );
};
