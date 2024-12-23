'use client'
import { PostType } from '@/app/schema/post.schema'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function RecentPostsHome() {
    const [recentPosts, setRecentPosts] = useState<PostType[] | []>([])

    useEffect(() => {
        async function fetchRecentPosts(length: number) {
            const fetchRecentPosts: PostType[] = await fetch(`/api/posts/get/${length}`).then(res => res.json());
            if (fetchRecentPosts.length > 0) {
                setRecentPosts(fetchRecentPosts);

            }
        }
        fetchRecentPosts(6)
    }, [])
    return (
        <div className="grid md:grid-cols-3 gap-6 ">
            {recentPosts.map((post: PostType) => (
                <Link href={`/post/${post.id}`} key={post.id} className="p-4 group cursor-pointer rounded-xl hover:scale-105 shadow-md hover:shadow-lg hover:shadow-gray-300 bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                    <div className="relative overflow-hidden rounded-xl">
                        <Image
                            src={post.image}
                            alt={post.title}
                            width={200}
                            height={200}
                            className="w-full rounded-xl border-2 border-gray-100 overflow-hidden h-[200px] object-cover transform group-hover:scale-105 transition-transform duration-300 shadow-lg"
                        />
                    </div>
                    <div className="px-2 pb-2 ">
                        <div className="flex flex-col items-start justify-start">
                            <h2 className="text-lg font-semibold mt-3 group-hover:text-blue-600 transition-colors">
                                {post.title?.split(' ').slice(0, 10).join(' ')}{(post.title?.split(' ').length ?? 0) > 10 ? '...' : ''}
                            </h2>
                            <p className="text-gray-600 mt-2">{post.excerpt.split(' ').slice(0, 15).join(' ')}{post.excerpt.split(' ').length > 10 ? '...' : ''}</p>

                        </div>
                        <div className="flex justify-between mt-2 items-center">
                            <p className="text-sm text-gray-500 mt-1">By <strong>{post.author}</strong></p>
                            <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
