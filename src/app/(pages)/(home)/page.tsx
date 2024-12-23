import React from "react";
import SideBar from "@/app/components/side_bar";
import Image from "next/image";
import RecentPostsHome from "./recent_posts.home";
import { getLatestPost } from "@/app/utils/db_utils";
import Link from "next/link";
import { PostType } from "../../schema/post.schema";
const BlogHomepage = async () => {
  if (typeof window !== 'undefined') return

  const latestPost: PostType | undefined = await getLatestPost();

  const featuredPost: PostType = {
    id: latestPost?.id || 0,
    title: latestPost?.title || '',
    excerpt: latestPost?.excerpt || '',
    image: latestPost?.image || '',
    createdAt: latestPost?.createdAt || 0,
    updatedAt: latestPost?.updatedAt || 0,
    linkYoutube: latestPost?.linkYoutube || '',
    author: latestPost?.author || '',
    content: latestPost?.content || ''
  };

  const duration = Math.round(featuredPost.content.split(' ').length / 200);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">


      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-2/3 ">
            {/* Featured Post */}
            <div className="mb-12 group p-4 rounded-xl bg-white shadow-lg">
              <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-lg">
                <Link href={`/post/${featuredPost.id}`} >
                  {featuredPost.image && <Image
                    src={featuredPost.image}
                    alt="Featured post"
                    width={1000}
                    height={1000}
                    className="w-full h-[400px]  object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />}
                </Link>
              </div>
              <Link href={`/post/${featuredPost.id}`}>
                <h2 className="font-bold mt-4 mb-2">{featuredPost.title}</h2>
              </Link>
              <p className="text-gray-600">{featuredPost.excerpt}</p>
              <p className="text-gray-600 font-bold mt-2">{featuredPost.author} - {duration} phút</p>
            </div>

            {/* Recent Posts Grid */}
            <h3 className="text-2xl font-bold mb-6">Bài viết mới</h3>
            <RecentPostsHome />
          </div>
          <SideBar />
        </div>
      </main >


    </div >
  );
};

export default BlogHomepage;