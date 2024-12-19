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
                    <div className="max-h-[80px] min-w-[80px] overflow-hidden rounded-lg shadow-lg border-2 border-gray-100 border-solid">
                        <Image
                            src={post.image}
                            alt={post.title}
                            width={500}
                            height={500}
                            className="w-[80px] h-[80px] object-cover overflow-hidden transform group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="flex flex-col items-start justify-start">
                        <h4 className="text-md font-semibold mt-3 group-hover:text-blue-600 transition-colors">
                            {post.title?.split(' ').slice(0, 10).join(' ')}{(post.title?.split(' ').length ?? 0) > 10 ? '...' : ''}
                        </h4>
                        <p className="text-gray-500 mt-2">{post.excerpt.split(' ').slice(0, 10).join(' ')}{post.excerpt.split(' ').length > 10 ? '...' : ''}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}
