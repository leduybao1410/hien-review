"use client"
import { TextEditor } from "@/app/components/single_post_comps/textEditor.componets";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPostLogic(post: any) {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [excerpt, setExcerpt] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [linkYoutube, setLinkYoutube] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [isSaved, setIsSaved] = useState<boolean>(false);

    useEffect(() => {
        if (post.title) {
            setTitle(post.title);
        }
        if (post.excerpt) {
            setExcerpt(post.excerpt);
        }
        if (post.content) {
            setContent(post.content);
        }
        if (post.author) {
            setAuthor(post.author);
        }
        if (post.image) {
            setImage(post.image);
        }
        if (post.linkYoutube) {
            setLinkYoutube(post.linkYoutube);
        }
    }, [post]);

    useEffect(() => {
        console.log(content);
    }, [content])


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSaved) {
            alert("Vui lòng lưu trước khi thêm bài viết");
            return;
        }
        // Check file type and size (Optional)
        if (file && file.size > 5 * 1024 * 1024) { // 5MB limit example
            alert("File size should be less than 5MB");
            return;
        }

        let imageUrl = image;

        if (file) {
            imageUrl = await handleImageChange();
        }

        console.log("Post updated:", { title, content, imageUrl, excerpt, author });
        const response = await fetch(`/api/posts/${post.id}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content, image: imageUrl, excerpt, author, linkYoutube }),
        });
        const responseData = await response.json();
        if (response.ok) {
            alert(responseData.message);
            router.push("/");
        } else {
            alert(responseData.message);
        }
    };

    const handleImageChange = async () => {
        try {
            if (!file) {
                console.log('No file selected');
                return;
            }

            const formData = new FormData();
            formData.append("file", file as Blob);

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
                return data.payload.url;
            } else {
                console.log(data.message);
                return null;
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert('An error occurred during the upload. Please try again.');
            return null;
        }
    }

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this post?")) {
            const response = await fetch(`/api/posts/${post.id}/delete`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert("Post deleted successfully");
                router.push("/");
            } else {
                alert("Failed to delete post");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} method="PUT" className="space-y-6">
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
                    className="w-full h-[300px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                /> */}
                <TextEditor content={content} setContent={setContent} isSaved={isSaved} setIsSaved={setIsSaved} />
            </div>
            <div>
                <label htmlFor="excerpt" className="block text-lg font-medium mb-2">Mô tả</label>
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
                <label htmlFor="image" className="block text-lg font-medium mb-2">Ảnh hiện tại</label>
                {(image !== "") && <img
                    src={image}
                    alt="Image Preview"
                    className="w-1/2 h-auto rounded-lg"
                />}
            </div>

            <div>
                <label htmlFor="image" className="block text-lg font-medium mb-2">Ảnh mới</label>
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
                    <label className="block text-lg font-medium mb-2">Ảnh xem trước</label>
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Image Preview"
                        className="w-1/2 h-auto rounded-lg"
                    />
                </div>
            )}

            <div className="flex gap-4">
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Lưu
                </button>
                <button
                    type="button"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    onClick={handleDelete}
                >
                    Xóa
                </button>
            </div>
        </form>
    )
}