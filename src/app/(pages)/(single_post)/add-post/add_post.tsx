"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import { TextEditor } from "@/app/components/single_post_comps/textEditor.componets";


export default function AddPostLogic() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [excerpt, setExcerpt] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [linkYoutube, setLinkYoutube] = useState<string>("");


    const editor = useEditor({
        extensions: [
            StarterKit,
            BulletList,
            ListItem,
        ],
        content: content,
    })



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle post submission logic here
        if (!file) {
            alert("Please upload an image");
            return;
        }

        // Check file type and size (Optional)
        if (file.size > 5 * 1024 * 1024) { // 5MB limit example
            alert("File size should be less than 5MB");
            return;
        }

        const formData = new FormData();
        formData.append("file", file as Blob);

        let image: string | null = null;

        try {
            const res = await fetch('/api/posts/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                alert('File upload failed');
                return;
            }

            const data = await res.json();
            if (data.status === 200) {
                const imageUrl = data.payload.url;
                image = imageUrl;
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert('An error occurred during the upload. Please try again.');
        }

        let convertedYoutubeLink = "";
        if (linkYoutube) {
            if (linkYoutube.includes("watch?v=")) {
                convertedYoutubeLink = linkYoutube.replace("watch?v=", "embed/");
                const tIndex = convertedYoutubeLink.indexOf("&t=");
                if (tIndex !== -1) {
                    convertedYoutubeLink = convertedYoutubeLink.substring(0, tIndex);
                }
            }
        }

        console.log("Post submitted:", { title, content, image, excerpt, author, convertedYoutubeLink });
        const response = await fetch('/api/posts/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content, image, excerpt, author, linkYoutube: convertedYoutubeLink }),
        });
        const responseData = await response.json();
        if (response.ok) {
            alert(responseData.message);
            router.push("/");
        } else {
            alert(responseData.message);
        }
        // Reset form fields
        setTitle("");
        setContent("");
        setFile(null);
        setExcerpt("");
        setAuthor("");
        setLinkYoutube("");
    };
    return (
        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-lg font-medium mb-2">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="author" className="block text-lg font-medium mb-2">Author</label>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-lg font-medium mb-2">Content</label>
                {/* <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={10}
                    required
                ></textarea> */}
                <TextEditor content={content} setContent={setContent} />

            </div>
            <div>
                <label htmlFor="excerpt" className="block text-lg font-medium mb-2">Excerpt</label>
                <input
                    type="text"
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="linkYoutube" className="block text-lg font-medium mb-2">Link Youtube</label>
                <input
                    type="text"
                    id="linkYoutube"
                    value={linkYoutube}
                    onChange={(e) => setLinkYoutube(e.target.value)}
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="image" className="block text-lg font-medium mb-2">Image File</label>
                <input
                    type="file"
                    accept="image/*"
                    id="image"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {file && (
                <div className="mt-4">
                    <label className="block text-lg font-medium mb-2">Image Preview</label>
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Image Preview"
                        className="w-1/2 h-auto rounded-lg"
                    />
                </div>
            )}

            <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Add Post
            </button>
        </form>
    )
}