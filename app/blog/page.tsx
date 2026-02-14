import { getAllPosts, getAllTags } from "@/lib/blog";
import { BlogListClient } from "./blog-list-client";

export const metadata = { title: "Blog — Abhinav Joshi" };

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  return <BlogListClient posts={posts} tags={tags} />;
}
