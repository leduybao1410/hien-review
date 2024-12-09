'use client'
import { PostType } from '@/app/schema/post.schema'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function RecentPostsSinglePost({ currentID }: { currentID: number }) {
    const [recentPosts, setRecentPosts] = useState<PostType[] | []>([])

    useEffect(() => {
        async function fetchRecentPosts(length: number) {
            try {
                const response = await fetch(`/api/posts/get/${length}`);
                if (!response.ok) {
                    console.error('Failed to fetch recent posts:', response.statusText);
                    return;
                }
                const fetchRecentPosts: PostType[] = await response.json();
                if (fetchRecentPosts.length > 0) {
                    setRecentPosts(fetchRecentPosts);
                }
            } catch (error) {
                console.error('Error fetching recent posts:', error);
            }
        }
        fetchRecentPosts(4)
    }, [])
    return (
        <div className="grid md:grid-cols-1 gap-6">
            {recentPosts.map((post: PostType) => (
                (post.id !== currentID) && <Link href={`/post/${post.id}`} key={post.id} className="group cursor-pointer flex flex-row gap-4">
                    <div className="relative overflow-hidden rounded-lg w-1/3">
                        <Image
                            src={post.image}
                            alt={post.title}
                            width={500}
                            height={500}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="w-2/3">
                        <h4 className="text-xl font-semibold mt-3 group-hover:text-blue-600 transition-colors">
                            {post.title}
                        </h4>
                        <p className="text-gray-500 mt-2">{post.excerpt.slice(0, 100)}...</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}
