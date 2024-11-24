interface PostView {
    postId: number;
    viewCount: number;
    updatedAt: number;
}

interface PostType {
    id: number;
    createdAt: number;
    updatedAt: number;
    title: string;
    image: string;
    excerpt: string;
    author: string;
    content: string;
    linkYoutube: string;
}

interface PostViewDB extends PostView {
    id: number;
}

export type { PostView, PostViewDB, PostType };