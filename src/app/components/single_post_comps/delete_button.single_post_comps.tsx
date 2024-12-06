'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DeleteButtonSinglePostComps({ id }: { id: string }) {
    const router = useRouter();
    const handleDeletePost = async () => {
        const confirm = window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?");
        if (confirm) {
            try {
                const response = await fetch(`/api/posts/${id}/delete`, {
                    method: 'DELETE',
                });
                if (response.status === 200) {
                    router.push('/');
                    router.refresh();
                }
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    }
    return (
        <Button variant={"destructive"} onClick={handleDeletePost}>Delete</Button>
    );
} 