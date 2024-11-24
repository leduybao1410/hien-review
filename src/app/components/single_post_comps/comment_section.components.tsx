"use client"

import { useState } from "react";
import { FaReply, FaThumbsUp, FaUser } from "react-icons/fa";

export default function CommentSection() {

    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([
        {
            id: 1,
            user: "John Doe",
            content: "Great article! Really enjoyed reading this.",
            likes: 5,
            replies: [
                {
                    id: 2,
                    user: "Jane Smith",
                    content: "Totally agree with your points!",
                    likes: 3
                }
            ]
        }
    ]);


    const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newComment.trim()) {
            const comment = {
                id: comments.length + 1,
                user: "Guest User",
                content: newComment,
                likes: 0,
                replies: []
            };
            setComments([...comments, comment]);
            setNewComment("");
        }
    };
    return (
        //  Comments Section 
        < div className="mb-8" >
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                ></textarea>
                <button
                    type="submit"
                    className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Post Comment
                </button>
            </form>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <FaUser className="text-gray-600" />
                                <span className="font-medium">{comment.user}</span>
                            </div>
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                                <FaThumbsUp />
                                <span>{comment.likes}</span>
                            </button>
                        </div>
                        <p className="mb-4">{comment.content}</p>
                        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                            <FaReply />
                            <span>Reply</span>
                        </button>

                        {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-8 mt-4 space-y-4">
                                {comment.replies.map((reply) => (
                                    <div key={reply.id} className="border-l-2 pl-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <FaUser className="text-gray-600" />
                                                <span className="font-medium">{reply.user}</span>
                                            </div>
                                            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                                                <FaThumbsUp />
                                                <span>{reply.likes}</span>
                                            </button>
                                        </div>
                                        <p>{reply.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div >
    )
}
