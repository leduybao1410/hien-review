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
    const [isSaved, setIsSaved] = useState<boolean>(false);

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
        if (isSaved) {
            alert("Vui lòng lưu trước khi thêm bài viết");
            return;
        }
        // Handle post submission logic here
        if (!file) {
            alert("Vui lòng tải lên một hình ảnh");
            return;
        }

        // Check file type and size (Optional)
        if (file.size > 5 * 1024 * 1024) { // 5MB limit example
            alert("Kích cỡ file không được lớn hơn 5MB");
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
                alert('Tải lên file thất bại');
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
            alert('Có lỗi xảy ra trong quá trình tải lên. Vui lòng thử lại.');
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
                <label htmlFor="title" className="block text-lg font-medium mb-2">Tiêu đề</label>
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
                <label htmlFor="author" className="block text-lg font-medium mb-2">Tác giả</label>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-lg font-medium mb-2">Nội dung</label>
                {/* <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={10}
                    required
                ></textarea> */}
                <TextEditor content={content} setContent={setContent} isSaved={isSaved} setIsSaved={setIsSaved} />

            </div>
            <div>
                <label htmlFor="excerpt" className="block text-lg font-medium mb-2">Tóm tắt</label>
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
                Thêm bài viết
            </button>
        </form>
    )
}