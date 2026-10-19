"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  type LucideIcon,
} from "lucide-react";

interface StoryEditorProps {
  initialContent?: Record<string, unknown> | string | null;
  onChange?: (content: any) => void;
  onHtmlChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Toolbar button helper
function ToolBtn({
  icon: Icon,
  active,
  disabled,
  onClick,
  title,
}: {
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        // Keep focus in the editor while using the toolbar
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`flex h-9 w-9 flex-shrink-0 select-none items-center justify-center rounded-lg transition-colors ${
        active ? "bg-brand-100 text-brand-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
      } disabled:opacity-30`}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
    </button>
  );
}

function Divider() {
  return <div className="mx-1.5 h-5 w-px flex-shrink-0 bg-zinc-200" />;
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
        // No `prose` class: we use .ProseMirror CSS in globals.css
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
  const run = () => editor.chain().focus();

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-card">
      {/* Toolbar: sticks under the 56px top bar while scrolling a long chapter */}
      <div className="sticky top-14 z-10 flex items-center gap-0.5 overflow-x-auto rounded-t-2xl border-b border-zinc-200 bg-white/95 px-3 py-2 backdrop-blur scrollbar-hide">
        <ToolBtn icon={Bold} title="Bold (Ctrl+B)" active={editor.isActive("bold")} disabled={!can.toggleBold().run() || disabled} onClick={() => run().toggleBold().run()} />
        <ToolBtn icon={Italic} title="Italic (Ctrl+I)" active={editor.isActive("italic")} disabled={!can.toggleItalic().run() || disabled} onClick={() => run().toggleItalic().run()} />
        <ToolBtn icon={UnderlineIcon} title="Underline (Ctrl+U)" active={editor.isActive("underline")} disabled={!can.toggleUnderline().run() || disabled} onClick={() => run().toggleUnderline().run()} />
        <ToolBtn icon={Strikethrough} title="Strikethrough" active={editor.isActive("strike")} disabled={!can.toggleStrike().run() || disabled} onClick={() => run().toggleStrike().run()} />

        <Divider />

        <ToolBtn icon={Heading2} title="Heading" active={editor.isActive("heading", { level: 2 })} disabled={disabled} onClick={() => run().toggleHeading({ level: 2 }).run()} />
        <ToolBtn icon={Heading3} title="Subheading" active={editor.isActive("heading", { level: 3 })} disabled={disabled} onClick={() => run().toggleHeading({ level: 3 }).run()} />

        <Divider />

        <ToolBtn icon={List} title="Bullet list" active={editor.isActive("bulletList")} disabled={disabled} onClick={() => run().toggleBulletList().run()} />
        <ToolBtn icon={ListOrdered} title="Numbered list" active={editor.isActive("orderedList")} disabled={disabled} onClick={() => run().toggleOrderedList().run()} />

        <Divider />

        <ToolBtn icon={Quote} title="Quote" active={editor.isActive("blockquote")} disabled={disabled} onClick={() => run().toggleBlockquote().run()} />
        <ToolBtn icon={Code} title="Code block" active={editor.isActive("codeBlock")} disabled={disabled} onClick={() => run().toggleCodeBlock().run()} />
        <ToolBtn icon={Minus} title="Divider" disabled={disabled} onClick={() => run().setHorizontalRule().run()} />

        <div className="ml-auto flex items-center gap-0.5 pl-2">
          <ToolBtn icon={Undo2} title="Undo (Ctrl+Z)" disabled={!editor.can().undo() || disabled} onClick={() => run().undo().run()} />
          <ToolBtn icon={Redo2} title="Redo (Ctrl+Y)" disabled={!editor.can().redo() || disabled} onClick={() => run().redo().run()} />
        </div>
      </div>

      {/* Writing surface */}
      <div className="min-h-[28rem] px-6 py-8 sm:px-12 sm:py-12">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
