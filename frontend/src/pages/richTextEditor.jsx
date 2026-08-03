import { useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  TextStyle,
  FontFamily,
  FontSize,
  Color,
} from "@tiptap/extension-text-style";

import "./richTextEditor.css";

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write your post...",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Underline,

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: value,

    editorProps: {
      attributes: {
        class: "rich-text-content",
        "data-placeholder": placeholder,
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter a URL:", previousUrl || "https://");

    if (url === null) {
      return;
    }

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const toolbarButtonClass = (active) =>
    active ? "editor-button active" : "editor-button";

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <div className="editor-toolbar-group">
          <select
            className="editor-select"
            value={
              editor.isActive("heading", { level: 1 })
                ? "h1"
                : editor.isActive("heading", { level: 2 })
                  ? "h2"
                  : editor.isActive("heading", { level: 3 })
                    ? "h3"
                    : "paragraph"
            }
            onChange={(event) => {
              const value = event.target.value;

              if (value === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                const level = Number(value.replace("h", ""));
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
            aria-label="Text style"
          >
            <option value="paragraph">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <select
            className="editor-select"
            value={editor.getAttributes("textStyle").fontFamily || ""}
            onChange={(event) => {
              const fontFamily = event.target.value;

              if (!fontFamily) {
                editor.chain().focus().unsetFontFamily().run();
                return;
              }

              editor.chain().focus().setFontFamily(fontFamily).run();
            }}
            aria-label="Font family"
          >
            <option value="">Default font</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="'Times New Roman'">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="'Courier New'">Courier New</option>
          </select>

          <select
            className="editor-select editor-font-size"
            value={editor.getAttributes("textStyle").fontSize || ""}
            onChange={(event) => {
              const fontSize = event.target.value;

              if (!fontSize) {
                editor.chain().focus().unsetFontSize().run();
                return;
              }

              editor.chain().focus().setFontSize(fontSize).run();
            }}
            aria-label="Font size"
          >
            <option value="">Size</option>
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="20px">20</option>
            <option value="24px">24</option>
            <option value="28px">28</option>
            <option value="32px">32</option>
            <option value="40px">40</option>
          </select>
        </div>

        <div className="editor-toolbar-group">
          <button
            type="button"
            className={toolbarButtonClass(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            className={toolbarButtonClass(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <em>I</em>
          </button>

          <button
            type="button"
            className={toolbarButtonClass(editor.isActive("underline"))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <u>U</u>
          </button>

          <button
            type="button"
            className={toolbarButtonClass(editor.isActive("strike"))}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <s>S</s>
          </button>

          <input
            className="editor-color-input"
            type="color"
            value={editor.getAttributes("textStyle").color || "#111827"}
            onChange={(event) =>
              editor.chain().focus().setColor(event.target.value).run()
            }
            title="Text color"
            aria-label="Text color"
          />
        </div>

        <div className="editor-toolbar-group">
          <button
            type="button"
            className={toolbarButtonClass(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet list"
          >
            • List
          </button>

          <button
            type="button"
            className={toolbarButtonClass(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered list"
          >
            1. List
          </button>

          <button
            type="button"
            className="editor-button"
            onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
            disabled={!editor.can().sinkListItem("listItem")}
            title="Create sub-bullet"
          >
            Indent
          </button>

          <button
            type="button"
            className="editor-button"
            onClick={() => editor.chain().focus().liftListItem("listItem").run()}
            disabled={!editor.can().liftListItem("listItem")}
            title="Remove sub-bullet"
          >
            Outdent
          </button>
        </div>

        <div className="editor-toolbar-group">
          <button
            type="button"
            className={toolbarButtonClass(
              editor.isActive({ textAlign: "left" }),
            )}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="Align left"
          >
            Left
          </button>

          <button
            type="button"
            className={toolbarButtonClass(
              editor.isActive({ textAlign: "center" }),
            )}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="Align center"
          >
            Center
          </button>

          <button
            type="button"
            className={toolbarButtonClass(
              editor.isActive({ textAlign: "right" }),
            )}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="Align right"
          >
            Right
          </button>
        </div>

        <div className="editor-toolbar-group">
          <button
            type="button"
            className={toolbarButtonClass(editor.isActive("blockquote"))}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
          >
            Quote
          </button>

          <button
            type="button"
            className={toolbarButtonClass(editor.isActive("codeBlock"))}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code block"
          >
            Code
          </button>

          <button
            type="button"
            className={toolbarButtonClass(editor.isActive("link"))}
            onClick={setLink}
            title="Add or edit link"
          >
            Link
          </button>

          <button
            type="button"
            className="editor-button"
            onClick={() =>
              editor.chain().focus().extendMarkRange("link").unsetLink().run()
            }
            disabled={!editor.isActive("link")}
            title="Remove link"
          >
            Unlink
          </button>
        </div>

        <div className="editor-toolbar-group">
          <button
            type="button"
            className="editor-button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            Undo
          </button>

          <button
            type="button"
            className="editor-button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            Redo
          </button>

          <button
            type="button"
            className="editor-button"
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
            title="Clear formatting"
          >
            Clear
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}