"use client"
import { getSinglePost } from "@/app/utils/db_utils";
import AddPostLogic from "./edit_post";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import EditPostLogic from "./edit_post";

const EditPost = () => {
    const router = useRouter();
    const pathname = usePathname();
    const id = pathname.split('/')[pathname.split('/').length - 2];

    const [post, setPost] = useState<any | null>(null);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json());

            if (response.status !== 200) {
                const path = pathname.charAt(0) === "/" ? pathname.slice(1) : pathname;
                router.push(`/login?from=${path}`);
            }
            if (response.status === 200) {
                getSinglePost();
            }
        } catch (error) {
            console.error('Error fetching authentication status:', error);
            router.push('/login');
        }
    };


    useEffect(() => {
        checkAuth();
    }, []);

    const getSinglePost = async () => {
        const post = await fetch(`/api/posts/${id}`);
        if (!post) {
            return;
        }
        const postData = await post.json();
        console.log('post data', postData);
        setPost(postData);
    }



    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Edit Post {id}</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <EditPostLogic
                    id={id}
                    title={post?.title}
                    content={post?.content}
                    excerpt={post?.excerpt}
                    author={post?.author}
                    linkYoutube={post?.linkYoutube}
                    image={post?.image}
                />
            </Suspense>
        </div>
    );
};

export default EditPost;

