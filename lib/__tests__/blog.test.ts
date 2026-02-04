import { getAllPosts, getPostBySlug, getAllTags } from "../blog";

describe("blog content loader", () => {
  it("loads all six posts, newest first", () => {
    const posts = getAllPosts();
    expect(posts).toHaveLength(6);
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(new Date(posts[i].date).getTime());
    }
  });

  it("parses required frontmatter fields", () => {
    const post = getPostBySlug("auth-microservice-migration");
    expect(post).not.toBeNull();
    expect(post?.title).toBe("Pulling Auth Out of the Monolith");
    expect(post?.tags).toContain("keycloak");
    expect(post?.company).toBe("Panaroma Intelligence Solutions");
  });

  it("computes a human-readable reading time", () => {
    const post = getPostBySlug("auth-microservice-migration");
    expect(post?.readingTime).toMatch(/\d+ min read/);
  });

  it("returns null for an unknown slug", () => {
    expect(getPostBySlug("does-not-exist")).toBeNull();
  });

  it("collects the union of all tags across posts", () => {
    const tags = getAllTags();
    expect(tags).toEqual(expect.arrayContaining(["fastapi", "keycloak", "redis"]));
    expect(new Set(tags).size).toBe(tags.length); // deduped
  });
});
