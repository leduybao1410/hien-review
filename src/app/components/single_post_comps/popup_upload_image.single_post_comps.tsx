import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';

function ImageUploadPopup({ isOpen, closePopup, editor }: { isOpen: boolean, closePopup: () => void, editor: Editor | null }) {
    const [image, setImage] = useState<File | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setImage(event.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                closePopup();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closePopup]);

    const handleUpload = async () => {
        try {

            if (!image) {
                alert('No file selected');
                return;
            }

            const formData = new FormData();
            formData.append("file", image as Blob);
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
                setImage(imageUrl);
                // editor?.commands.setImage({ src: imageUrl, alt: 'Image', title: 'Image' });
                editor?.commands.insertContent(`<img src="${imageUrl}" alt="Uploaded Image" />`);
                closePopup();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert('Có lỗi xảy ra trong quá trình tải lên. Vui lòng thử lại.');
        }
    }

    return (
        <div className={`z-50 fixed w-full h-full inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div ref={popupRef} className='bg-white w-1/2 h- rounded-lg p-6'>

                <div
                    className="w-full h-[90%] bg-gray-200 rounded-lg p-4"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    {!image &&
                        <div className='flex flex-col items-center justify-center'>
                            <p>Kéo và thả hình ảnh của bạn vào đây</p>
                            <input
                                className='w-full h-[300px] bg-gray-300 rounded-lg p-2 relative flex items-center justify-center'
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    }
                    {image && (
                        <div className="mt-4">
                            <p className='text-center font-bold mb-2'>Hình ảnh đã chọn:</p>
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className={`w-full max-h-[350px] object-contain rounded-lg`}
                            />
                            <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={() => setImage(null)}>Xóa</button>
                        </div>
                    )}
                </div>
                {image && <p>Hình ảnh đã chọn: {image.name}</p>}
                <div className='flex justify-end gap-2 mt-2'>
                    <button type='button' className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={() => handleUpload()}>Tải lên</button>
                    <button type='button' className='bg-gray-500 text-white px-4 py-2 rounded-md' onClick={closePopup}>Đóng</button>
                </div>
            </div>
        </div>
    );
}

export default ImageUploadPopup;
