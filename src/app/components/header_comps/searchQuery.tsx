"use client"
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { PostType } from "@/app/schema/post.schema";
import Link from "next/link";

export default function SearchQuery() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<PostType[]>([]);

    async function fetchSearchResults() {
        const res = await fetch(`/api/search?query=${searchQuery}`);
        const data = await res.json();
        setSearchResult(data);
    }

    useEffect(() => {
        if (searchQuery.trim() !== "") {
            fetchSearchResults();
        } else {
            setSearchResult([]);
        }
    }, [searchQuery]);

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            {(searchQuery !== "") && <div className="absolute right-0 top-12 w-[400px] p-4 bg-[rgba(0,0,0,0.8)] rounded-lg">
                <p className="text-white text-xl font-bold mb-2">Search Results</p>
                <div className="flex flex-col gap-2">

                    {searchResult.map((result, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg flex flex-row gap-2">
                            <div className="w-[80%] flex-col gap-2">
                                <Link href={`/post/${result.id}`}><h4 className="text-black text-lg font-bold">{result.title}</h4></Link>
                                <p className="text-[12px] text-gray-500">{result.excerpt}</p>
                            </div>
                            <div className="w-[20%]">
                                <Link href={`/post/${result.id}`}><img src={result.image} alt="Search Result Image" className="w-full aspect-square object-cover rounded-lg mb-2" /></Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
        </div>
    )
}
