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
import { cookies } from 'next/headers';
import DeleteButtonSinglePostComps from '@/app/components/single_post_comps/delete_button.single_post_comps';
import ScrollButton from '@/app/components/single_post_comps/scroll_button.components';



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

    function getTableOfContents(content: string) {
        const headings = content.match(/<h[1-2][^>]*>(.*?)<\/h[1-2]>/g) || [];
        const toc = headings.map(heading => {
            const levelMatch = heading.match(/<h([1-2])/);
            const level = levelMatch ? parseInt(levelMatch[1]) : 0;
            const text = heading.replace(/<[^>]+>/g, '');
            return { text, level, id: `heading-${level}-${text}` };
        });

        return toc;
    }

    const toc = getTableOfContents(singlePost.content);

    const checkAuth = async () => {
        console.log("Checking authentication");
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('sessionToken')?.value;

        if (!sessionToken) {
            console.log("No session token found");
            return false;
        }
        return true;
    };

    const auth = await checkAuth() ?? false;

    return (
        <div className="flex justify-center items-center bg-[#f5f5f5]">
            <div className='container flex flex-col md:flex-row gap-6'>


                <div className="lg:w-[70%] px-4 py-8 bg-white rounded-2xl border border-gray-100 shadow-xl my-10 mx-4">
                    {/* Post Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">{singlePost.title}</h1>
                        <div className="flex flex-col md:flex-row gap-4 justify-between item-center">
                            <div className="flex items-center space-x-4 text-gray-600">
                                <div className="flex items-center">
                                    <FaUser className="mr-2" />
                                    <span>{singlePost.author}</span>
                                </div>
                                <span>|</span>
                                <span>Ngày đăng: {singlePost.createdAt ? new Date(singlePost.createdAt).toLocaleDateString() : "No date available"}</span>
                                <span>|</span>
                                <span>Lượt xem: {viewCount}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth && (
                                    <div className="flex justify-end">
                                        <Link href={`/post/${id}/edit`} className="bg-blue-500 text-white px-4 py-2 rounded-md">Edit</Link>
                                    </div>
                                )}
                                {auth && (
                                    <div className="flex justify-end">
                                        <DeleteButtonSinglePostComps id={id} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="prose max-w-none mb-8">
                        <Image
                            src={singlePost.image ? singlePost.image : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"}
                            alt={singlePost.title ?? "No image available"}
                            className="w-full h-96 object-cover rounded-lg mb-6"
                            width={1000}
                            height={1000}
                        />
                        <div
                            className=" text-lg mb-4 "
                        >
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Mục lục</h2>
                                <ul className="list-none p-0">
                                    {toc.map((item: any, index: any) => (
                                        <li key={index} className="ml-0">
                                            <ScrollButton targetId={`heading-${index}`} item={item} label={item.text} />
                                        </li>
                                    ))}
                                    {singlePost.linkYoutube !== '' && <li>
                                        <ScrollButton targetId={`youtube`} label={`Video Youtube`} />
                                    </li>}
                                </ul>
                            </div>
                            <div
                                dangerouslySetInnerHTML={{ __html: singlePost.content ?? "No content available" }}
                            />
                        </div>
                        <div className="mb-6 ">
                            {singlePost.linkYoutube !== '' &&
                                <iframe
                                    id="youtube"
                                    src={singlePost.linkYoutube}
                                    title={singlePost.title}
                                    className="rounded-lg mx-auto lg:w-[700px] lg:h-[400px] w-[300px] h-[169px]"
                                    allowFullScreen
                                ></iframe>
                            }
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


                    {/* <CommentSection /> */}
                </div>
                <div className="lg:w-[30%] sticky top-[80px] h-fit flex flex-col gap-6   px-4 py-8 bg-white rounded-2xl border border-gray-100 shadow-xl my-10 mx-4">
                    <h2 className="text-2xl font-bold ">Bài viết liên quan</h2>
                    <RecentPostsSinglePost currentID={parseInt(id)} />
                    {/* Related Posts */}
                    <hr className="w-full border-gray-200 my-4"></hr>
                    <div className="w-full flex flex-col items-center justify-center">
                        <div className="flex flex-col items-center justify-center text-gray-800">
                            <p className="italic leading-relaxed text-center mb-5">"Hi vọng qua các bài đánh giá của kênh Hiển Review, các bạn sẽ dễ dàng tìm được thiết bị phù hợp với mục đích và nhu cầu phục vụ cho công việc của bản thân. "</p>
                            <p className="font-bold ">Tên đầy đủ: Hồ Thái Hiển - {new Date().getFullYear() - 1993} tuổi</p>
                            <p className="font-bold ">Kênh Youtube: <Link className="text-red-500" href="https://www.youtube.com/@Hien_review">Hiển Review</Link></p>
                            <p className="font-bold ">Facebook: <Link className="text-blue-500" href="https://www.facebook.com/HienReviewTechAudio">Hiển Review Fanpage</Link></p>
                            <p className="font-bold ">Gmail: <Link className="text-green-500" href="mailto:hienreviewer@gmail.com">hienreviewer@gmail.com</Link></p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default BlogPost;
