import { Metadata } from 'next';
import CommentSection from "@/app/components/single_post_comps/comment_section.components";
import { FaFacebook, FaTwitter, FaLinkedin, FaUser } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { getRecentPosts, getSinglePost } from "@/app/utils/db_utils";
import RecentPostsSinglePost from "./recent_posts.single_post";
import Link from "next/link";
import { getPostViewCount } from '@/app/utils/stat_tracking_utils';
import { PostType } from '@/app/schema/post.schema';
import Image from 'next/image';

export const dynamicParams = false;

// // Generate static params for each post at build time
export async function generateStaticParams() {
    try {
        const posts = await getRecentPosts();
        return posts.map((post: PostType) => ({
            id: (post.id).toString(),
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

type Params = Promise<{ id: string }>;

// This metadata function is optional but helpful for SEO
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const post = await getSinglePost(id);
    return { title: post?.title || "Blog Post" };
}


const BlogPost = async ({ params }: { params: Params }) => {
    const id = (await params).id;
    // Fetch the single post and navigation posts before and after
    const singlePost = await getSinglePost(id);
    const beforePost = await getSinglePost((parseInt(id) - 1).toString());
    const afterPost = await getSinglePost((parseInt(id) + 1).toString());

    if (!singlePost) {
        return <div className="max-w-4xl mx-auto px-4 py-8 h-[50vh] flex items-center justify-center text-2xl font-bold">Post not found</div>;
    }

    // Get the view count and update it
    const viewCount = await getPostViewCount(id, true);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Post Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{singlePost.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                        <FaUser className="mr-2" />
                        <span>{singlePost.author}</span>
                    </div>
                    <span>|</span>
                    <span>Published: {singlePost.createdAt ? new Date(singlePost.createdAt).toLocaleDateString() : "No date available"}</span>
                    <span>|</span>
                    <span>Views: {viewCount}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="prose max-w-none mb-8">
                <Image
                    src={singlePost.image ?? "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"}
                    alt={singlePost.title ?? "No image available"}
                    className="w-full h-96 object-cover rounded-lg mb-6"
                    width={1000}
                    height={1000}
                />
                <p className="text-lg mb-4">
                    {singlePost.content ?? "No content available"}
                </p>
                <div className="aspect-w-16 aspect-h-9 mb-6 ">
                    {singlePost.linkYoutube !== '' && <iframe
                        src={singlePost.linkYoutube}
                        title={singlePost.title}
                        className="rounded-lg mx-auto lg:w-[700px] lg:h-[400px] w-[300px] h-[169px]"
                        allowFullScreen
                    ></iframe>}
                </div>
            </div>

            {/* Social Sharing */}
            {/* <div className="flex space-x-4 mb-8">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <FaFacebook />
                    <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">
                    <FaTwitter />
                    <span>Tweet</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition">
                    <FaLinkedin />
                    <span>Share</span>
                </button>
            </div> */}

            {/* Post Navigation */}
            <div className="flex justify-between mb-12">
                {beforePost ? (
                    <Link href={`/post/${beforePost.id}`} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                        <IoIosArrowBack />
                        <span>{beforePost.title}</span>
                    </Link>
                ) : null}
                {afterPost ? (
                    <Link href={`/post/${afterPost.id}`} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                        <span>{afterPost.title}</span>
                        <IoIosArrowForward />
                    </Link>
                ) : null}
            </div>

            {/* Related Posts */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                <RecentPostsSinglePost currentID={parseInt(id)} />
            </div>
            {/* <CommentSection /> */}
        </div>
    );
};

export default BlogPost;
