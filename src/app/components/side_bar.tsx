import { getSinglePost } from "../utils/db_utils";
import { formatViewCount, getPopularPosts } from "../utils/stat_tracking_utils";
import SubcribeSection from "./side_bar_comps/subcriber_section.side_bar";
import Link from "next/link";

{/* Sidebar */ }
export default async function SideBar() {


    const popularPosts = await getPopularPosts(3);

    const popularPostList = await Promise.all(popularPosts.map(async (post) => {
        const views = await getSinglePost(post.postId.toString());
        return { ...views, views: post.viewCount };
    }));


    return (
        <aside className="lg:w-1/3">
            {/* Popular Posts Widget */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                <h3 className="text-xl font-bold mb-4">Popular Posts</h3>
                <div className="space-y-4">
                    {popularPostList.map((post) => (
                        <div key={post.id} className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-blue-500">{formatViewCount(post.views)} views</span>
                            <Link href={`/post/${post.id}`}>
                                <h4 className="flex-1 text-gray-800 hover:text-blue-600 cursor-pointer transition-colors">
                                    {post.title}
                                </h4>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            {/* Newsletter Subscription */}
            <SubcribeSection />

        </aside>
    )
}