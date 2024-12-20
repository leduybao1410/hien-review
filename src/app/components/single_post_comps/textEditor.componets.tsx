'use client'

import { useEffect, useState } from 'react';
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Underline } from '@tiptap/extension-underline';
import { Heading, Level } from '@tiptap/extension-heading';
import { Paragraph } from '@tiptap/extension-paragraph';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';

export const TextEditor = ({ content, setContent, isSaved, setIsSaved }: { content: string, setContent: (content: string) => void, isSaved: boolean, setIsSaved: (isSaved: boolean) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Italic,
            Underline,
            Heading,
            Paragraph,
            BulletList,
            OrderedList,
        ],
        content,
        onUpdate: () => {
            setIsSaved(false);
        },
    })

    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isSaved) {
            handleContentChange();
            setSavedMessage("Chỉnh sửa đã được lưu");
            setTimeout(() => {
                setSavedMessage(null);
            }, 3000);
        }
    }, [isSaved])

    const handleContentChange = () => {
        if (!editor) return;
        const oldContent = editor.getHTML();
        const parser = new DOMParser();
        const doc = parser.parseFromString(oldContent, 'text/html');
        const headings = doc.querySelectorAll('h1, h2');
        headings.forEach((heading, index) => {
            heading.id = `heading-${index}`;
        });
        const newContent = doc.body.innerHTML;
        editor.commands.setContent(newContent);
        setContent(newContent);
    }


    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(content);
        }
    }, [content]);

    if (!editor) return null;

    return (
        <>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className='border border-gray-300 rounded-md p-2 max-h-[300px] min-h-[200px] overflow-y-auto' />
            <div className='flex flex-col items-end'>
                <button type='button' disabled={isSaved} className={`transition-all duration-500 ${isSaved ? 'bg-gray-500' : 'bg-blue-500'} text-white py-2 px-4 rounded-full mt-2`} onClick={() => setIsSaved(true)}>Lưu chỉnh sửa</button>
                {savedMessage && <p className="text-green-500 text-sm mt-2 font-bold">{savedMessage}</p>}
            </div>
        </>
    )
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const formatButton = (label: string, activeName: string, toggleFunction: () => void) => {
        if (!editor) return null;
        return (
            <button
                type='button'
                onClick={toggleFunction}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition duration-200 ${editor.isActive(activeName) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
                {label}
            </button>
        );
    }

    const formatHeadingButton = (label: string, toggleFunction: () => void) => {
        if (!editor) return null;
        return (
            <button
                type='button'
                onClick={toggleFunction}
                className={`px-4 py-2 rounded-md font-bold focus:outline-none focus:border-none text-sm transition duration-200 ${editor.isActive('heading', { level: parseInt(label.slice(-1)) }) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
                {label}
            </button>
        );
    }

    const toggleBold = () => {
        if (editor.isFocused) {
            editor.chain().toggleBold().run();
        } else {
            editor.chain().focus().toggleBold().run();
        }
    };

    const toggleItalic = () => {
        if (editor.isFocused) {
            editor.chain().toggleItalic().run();
        } else {
            editor.chain().focus().toggleItalic().run();
        }
    };

    const toggleUnderline = () => {
        if (editor.isFocused) {
            editor.chain().toggleUnderline().run();
        } else {
            editor.chain().focus().toggleUnderline().run();
        }
    };

    const toggleHeading = (level: Level) => {
        if (editor.isFocused) {
            editor.chain().toggleHeading({ level }).run();
        } else {
            editor.chain().focus().toggleHeading({ level }).run();
        }
    };

    const toggleParagraph = () => {
        if (editor.isFocused) {
            editor.chain().setParagraph().run();
        } else {
            editor.chain().focus().setParagraph().run();
        }
    };

    const toggleBulletList = () => {
        if (editor.isFocused) {
            editor.chain().toggleBulletList().run();
        } else {
            editor.chain().focus().toggleBulletList().run();
        }
    };

    const toggleOrderedList = () => {
        if (editor.isFocused) {
            editor.chain().toggleOrderedList().run();
        } else {
            editor.chain().focus().toggleOrderedList().run();
        }
    };

    return (
        <div className="flex gap-2 my-2">
            {formatButton('Bold', 'bold', toggleBold)}
            {formatButton('Italic', 'italic', toggleItalic)}
            {formatButton('Underline', 'underline', toggleUnderline)}
            {formatHeadingButton('H1', () => toggleHeading(1))}
            {formatHeadingButton('H2', () => toggleHeading(2))}
            {formatHeadingButton('H3', () => toggleHeading(3))}
            {formatButton('Paragraph', 'paragraph', toggleParagraph)}
            {formatButton('Bullet List', 'bulletList', toggleBulletList)}
            {formatButton('Ordered List', 'orderedList', toggleOrderedList)}
        </div>
    );
}