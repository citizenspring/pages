import { getTwitterUsers } from "../lib/twitter";

describe("twitter", () => {
  it("retrieves usernames", async () => {
    const users = await getTwitterUsers(["xdamman", "leen_schelfhout"]);
    // console.log(users);
    expect(users.length).toEqual(2);
    expect(users[0].username).toEqual("xdamman");
    expect(users[0].profile_image_url).toContain("https://");
  });
});
