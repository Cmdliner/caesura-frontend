"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useState } from "react";

interface StoryEditorProps {
  initialContent?: string;
  onChange?: (content: any) => void;
  onHtmlChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function StoryEditor({
  initialContent = "",
  onChange,
  onHtmlChange,
  placeholder = "Start writing your story...",
  disabled = false,
}: StoryEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "text-base leading-relaxed mb-4",
          },
        },
        heading: {
          levels: [2, 3],
          HTMLAttributes: {
            h2: { class: "text-2xl font-bold mt-6 mb-3" },
            h3: { class: "text-xl font-semibold mt-4 mb-2" },
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-inside ml-4 mb-4 space-y-1",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-inside ml-4 mb-4 space-y-1",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-orange-500 pl-4 italic text-zinc-600 my-4",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-zinc-900 text-white p-4 rounded-lg overflow-x-auto my-4",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none min-h-96 p-6 bg-white rounded-lg border transition-colors ${
          isFocused
            ? "border-orange-400 ring-1 ring-orange-100"
            : "border-zinc-200 hover:border-zinc-300"
        }`,
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const html = editor.getHTML();
      onChange?.(json);
      onHtmlChange?.(html);
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    editable: !disabled,
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
        {/* Text Style Group */}
        <div className="flex gap-1 border-r border-zinc-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run() || disabled}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive("bold")
                ? "bg-orange-500 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Bold (Ctrl+B)"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 3a1 1 0 011-1h6a3 3 0 110 6H7V3zM7 9h5a3 3 0 110 6H7V9z" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run() || disabled}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive("italic")
                ? "bg-orange-500 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Italic (Ctrl+I)"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 5a1 1 0 100 2h2.707L8.707 13.293a1 1 0 100 1.414L9 15h4a1 1 0 100-2h-2.707l3-3a1 1 0 00-1.414-1.414L13 9H9z" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run() || disabled}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive("underline")
                ? "bg-orange-500 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Underline (Ctrl+U)"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 11-2 0V5H5v11a4 4 0 004 4h4a4 4 0 004-4v-3a1 1 0 112 0v3a6 6 0 01-6 6H7a6 6 0 01-6-6V5a1 1 0 01-1-1z" />
            </svg>
          </button>
        </div>

        {/* Heading Group */}
        <div className="flex gap-1 border-r border-zinc-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-orange-500 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            } disabled:opacity-50`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "bg-orange-500 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            } disabled:opacity-50`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        {/* List Group */}
        <div className="flex gap-1 border-r border-zinc-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive("bulletList")
                ? "bg-orange-500 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
            title="Bullet List"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 100-2 1 1 0 000 2zm0 6a1 1 0 100-2 1 1 0 000 2zm0 6a1 1 0 100-2 1 1 0 000 2zm6-10a1 1 0 011-1h10a1 1 0 110 2H10a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H10a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H10a1 1 0 01-1-1z" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive("orderedList")
                ? "bg-orange-500 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
            title="Numbered List"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 100-2 1 1 0 000 2zm0 6a1 1 0 100-2 1 1 0 000 2zm0 6a1 1 0 100-2 1 1 0 000 2zm6-10a1 1 0 011-1h10a1 1 0 110 2H10a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H10a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H10a1 1 0 01-1-1z" />
            </svg>
          </button>
        </div>

        {/* Block Group */}
        <div className="flex gap-1 border-r border-zinc-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive("blockquote")
                ? "bg-orange-500 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
            title="Quote"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 11-2 0V7H5v7h2a1 1 0 010 2H4a1 1 0 01-1-1V6zm12 0a1 1 0 011-1h.5a1 1 0 011 1v2a1 1 0 11-2 0V7h-1a1 1 0 01-1-1v9a1 1 0 001 1h.5a1 1 0 100-2H15V6z" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive("codeBlock")
                ? "bg-orange-500 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
            title="Code Block"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 11-2 0V5H5v10h2a1 1 0 110 2H4a1 1 0 01-1-1V4z" />
            </svg>
          </button>
        </div>

        {/* Utility */}
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo() || disabled}
            className="p-2 rounded-lg bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7m7 14h-5a2 2 0 01-2-2V7a2 2 0 012-2h5" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo() || disabled}
            className="p-2 rounded-lg bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Redo"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l7-7-7-7m-8-2h5a2 2 0 012 2v12a2 2 0 01-2 2h-5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
