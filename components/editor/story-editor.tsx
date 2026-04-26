"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

interface StoryEditorProps {
  initialContent?: Record<string, unknown> | string | null;
  onChange?: (content: any) => void;
  onHtmlChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Toolbar button helper
function ToolBtn({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        // Prevent the editor from losing focus when clicking toolbar buttons
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      aria-pressed={active}
      className={`flex h-8 min-w-[32px] items-center justify-center rounded-md px-1.5 text-sm font-semibold transition-colors select-none
        ${active
          ? "bg-zinc-900 text-white"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        }
        disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-zinc-200 mx-1 flex-shrink-0" />;
}

export default function StoryEditor({
  initialContent = "",
  onChange,
  onHtmlChange,
  placeholder = "Start writing…",
  disabled = false,
}: StoryEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Let StarterKit handle everything; override only what differs
        heading: { levels: [2, 3] },
        // Disable code block default keyboard shortcut clash
        codeBlock: { exitOnArrowDown: true },
      }),
      Link.configure({ openOnClick: false }),
      Underline,
    ],
    content: initialContent ?? "",
    editorProps: {
      attributes: {
        // No `prose` class — we use .ProseMirror CSS in globals.css
        class: "focus:outline-none",
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
      onHtmlChange?.(editor.getHTML());
    },
    editable: !disabled,
    immediatelyRender: false,
  });

  if (!editor) return null;

  const can = editor.can().chain().focus();

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-zinc-100 bg-zinc-50/80 sticky top-0 z-10">

        {/* Text style */}
        <ToolBtn
          active={editor.isActive("bold")}
          disabled={!can.toggleBold().run() || disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h8a4 4 0 010 8H6V4zm0 8h9a4 4 0 010 8H6v-8z"/>
          </svg>
        </ToolBtn>

        <ToolBtn
          active={editor.isActive("italic")}
          disabled={!can.toggleItalic().run() || disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1="19" y1="4" x2="10" y2="4"/>
            <line x1="14" y1="20" x2="5" y2="20"/>
            <line x1="15" y1="4" x2="9" y2="20"/>
          </svg>
        </ToolBtn>

        <ToolBtn
          active={editor.isActive("underline")}
          disabled={!can.toggleUnderline().run() || disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M6 3v7a6 6 0 0012 0V3"/>
            <line x1="4" y1="21" x2="20" y2="21"/>
          </svg>
        </ToolBtn>

        <ToolBtn
          active={editor.isActive("strike")}
          disabled={!can.toggleStrike().run() || disabled}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1="4" y1="12" x2="20" y2="12"/>
            <path d="M17.5 6.5C17.5 4.5 15.5 3 12 3s-5.5 1.5-5.5 4c0 1.5.8 2.5 2 3.2"/>
            <path d="M6.5 17c0 2 2 3.5 5.5 3.5s5.5-1.5 5.5-4c0-1.2-.5-2.2-1.5-3"/>
          </svg>
        </ToolBtn>

        <Divider />

        {/* Headings */}
        <ToolBtn
          active={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <span className="text-[11px] font-black tracking-tight">H2</span>
        </ToolBtn>

        <ToolBtn
          active={editor.isActive("heading", { level: 3 })}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <span className="text-[11px] font-black tracking-tight">H3</span>
        </ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn
          active={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="4" cy="6"  r="1.2" fill="currentColor" stroke="none"/>
            <circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none"/>
            <circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none"/>
            <line x1="8" y1="6"  x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
          </svg>
        </ToolBtn>

        <ToolBtn
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <line x1="10" y1="6"  x2="21" y2="6"/>
            <line x1="10" y1="12" x2="21" y2="12"/>
            <line x1="10" y1="18" x2="21" y2="18"/>
            <path d="M4 8V5h-1" strokeWidth={1.75}/>
            <path d="M3 11h2v1l-2 2h2" strokeWidth={1.75}/>
            <path d="M3 17h2l-2 2h2" strokeWidth={1.75}/>
          </svg>
        </ToolBtn>

        <Divider />

        {/* Block elements */}
        <ToolBtn
          active={editor.isActive("blockquote")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
          </svg>
        </ToolBtn>

        <ToolBtn
          active={editor.isActive("codeBlock")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code block"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        </ToolBtn>

        <ToolBtn
          active={false}
          disabled={disabled}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12"/>
          </svg>
        </ToolBtn>

        {/* Undo / Redo — pushed to the right */}
        <div className="ml-auto flex items-center gap-0.5">
          <ToolBtn
            active={false}
            disabled={!editor.can().undo() || disabled}
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo (Ctrl+Z)"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10h10a5 5 0 010 10H9"/>
              <path d="M3 10l4-4M3 10l4 4"/>
            </svg>
          </ToolBtn>
          <ToolBtn
            active={false}
            disabled={!editor.can().redo() || disabled}
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo (Ctrl+Y)"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10H11a5 5 0 000 10h4"/>
              <path d="M21 10l-4-4m4 4l-4 4"/>
            </svg>
          </ToolBtn>
        </div>
      </div>

      {/* ── Writing surface ───────────────────────────────────────── */}
      <div className="px-8 py-8 sm:px-12 sm:py-10">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
