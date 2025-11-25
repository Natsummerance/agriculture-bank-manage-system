import { useEffect, useRef, useState, type ReactNode } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Eraser,
  Undo2,
  Redo2,
  ImagePlus,
} from "lucide-react";
import { cn } from "../ui/utils";
import { uploadFile } from "../../utils/uploadService";
import { toast } from "sonner";

interface RichTextEditorProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-xl border border-white/10 max-w-full my-3 shadow-lg shadow-emerald-500/15",
        },
      }),
      Placeholder.configure({
        placeholder: "如：有机标准种植，48小时内发货，支持产地直播验货…",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "tiptap-editor text-sm leading-relaxed text-white/90 focus:outline-none selection:bg-emerald-500/30",
      },
    },
    content: value ?? "",
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (typeof value === "string" && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  const insertImage = async (file: File) => {
    if (!editor) return;
    try {
      setIsUploading(true);
      const result = await uploadFile(file, "image");
      editor
        .chain()
        .focus()
        .setImage({
          src: result.url,
          alt: result.filename,
          title: result.filename,
        })
        .run();
      toast.success("图片已插入，可继续编辑图文说明");
    } catch (error) {
      const message = error instanceof Error ? error.message : "图片上传失败，请稍后重试";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await insertImage(file);
    event.target.value = "";
  };

  const toolbarButton = (
    opts: {
      label: string;
      icon: ReactNode;
      onClick: () => void;
      active?: boolean;
      disabled?: boolean;
    },
    key: string,
  ) => (
    <button
      key={key}
      type="button"
      onClick={opts.onClick}
      disabled={opts.disabled}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/70 transition",
        "hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/60",
        opts.active && "bg-white/15 text-white",
        opts.disabled && "opacity-40 cursor-not-allowed hover:bg-transparent",
      )}
    >
      {opts.icon || opts.label}
    </button>
  );

  return (
    <div className="space-y-2">
      {label && <div className="text-sm text-white/70">{label}</div>}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <div className="flex flex-wrap items-center gap-1 border-b border-white/10 px-3 py-2">
          {toolbarButton(
            {
              label: "粗体",
              icon: <Bold className="h-4 w-4" />,
              onClick: () => editor?.chain().focus().toggleBold().run(),
              active: editor?.isActive("bold"),
              disabled: !editor?.can().chain().focus().toggleBold().run(),
            },
            "bold",
          )}
          {toolbarButton(
            {
              label: "斜体",
              icon: <Italic className="h-4 w-4" />,
              onClick: () => editor?.chain().focus().toggleItalic().run(),
              active: editor?.isActive("italic"),
              disabled: !editor?.can().chain().focus().toggleItalic().run(),
            },
            "italic",
          )}
          {toolbarButton(
            {
              label: "无序列表",
              icon: <List className="h-4 w-4" />,
              onClick: () => editor?.chain().focus().toggleBulletList().run(),
              active: editor?.isActive("bulletList"),
              disabled: !editor?.can().chain().focus().toggleBulletList().run(),
            },
            "bullet",
          )}
          {toolbarButton(
            {
              label: "有序列表",
              icon: <ListOrdered className="h-4 w-4" />,
              onClick: () => editor?.chain().focus().toggleOrderedList().run(),
              active: editor?.isActive("orderedList"),
              disabled: !editor?.can().chain().focus().toggleOrderedList().run(),
            },
            "ordered",
          )}
          {toolbarButton(
            {
              label: "引用",
              icon: <Quote className="h-4 w-4" />,
              onClick: () => editor?.chain().focus().toggleBlockquote().run(),
              active: editor?.isActive("blockquote"),
              disabled: !editor?.can().chain().focus().toggleBlockquote().run(),
            },
            "quote",
          )}
          <span className="mx-2 h-6 w-px rounded-full bg-white/10" />
          {toolbarButton(
            {
              label: "撤销",
              icon: <Undo2 className="h-4 w-4" />,
              onClick: () => editor?.chain().focus().undo().run(),
              disabled: !editor?.can().chain().focus().undo().run(),
            },
            "undo",
          )}
          {toolbarButton(
            {
              label: "重做",
              icon: <Redo2 className="h-4 w-4" />,
              onClick: () => editor?.chain().focus().redo().run(),
              disabled: !editor?.can().chain().focus().redo().run(),
            },
            "redo",
          )}
          {toolbarButton(
            {
              label: "清空",
              icon: <Eraser className="h-4 w-4" />,
              onClick: () => editor?.chain().focus().clearContent(true).run(),
              disabled: !editor?.getHTML() || editor?.getText().trim().length === 0,
            },
            "clear",
          )}
          <span className="mx-2 h-6 w-px rounded-full bg-white/10" />
          {toolbarButton(
            {
              label: "插入图片",
              icon: <ImagePlus className="h-4 w-4" />,
              onClick: () => fileInputRef.current?.click(),
              disabled: isUploading || !editor,
            },
            "image",
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="px-3 py-2">
          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <div className="min-h-[160px] text-sm text-white/40">富文本编辑器加载中…</div>
          )}
        </div>
      </div>
      <div className="text-xs text-white/40">
        支持 TipTap 富文本格式，可插入图片、列表、引用等图文描述。
      </div>
    </div>
  );
}
