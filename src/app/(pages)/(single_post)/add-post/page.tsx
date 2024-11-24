"use client"
import AddPostLogic from "./add_post";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";

const AddPost = () => {
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
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
            } catch (error) {
                console.error('Error fetching authentication status:', error);
                router.push('/login');
            }
        };
        checkAuth();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Add New Post</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <AddPostLogic />
            </Suspense>
        </div>
    );
};

export default AddPost;

