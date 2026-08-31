"use client";

import { type Editor } from "@tiptap/react";

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm ${
        active
          ? "bg-blue-600 text-white"
          : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
      }`}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor }: { editor: Editor }) {
  const currentBlock = editor.isActive("heading", { level: 1 })
    ? "1"
    : editor.isActive("heading", { level: 2 })
      ? "2"
      : editor.isActive("heading", { level: 3 })
        ? "3"
        : "paragraph";

  function changeBlock(value: string) {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number(value) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 p-2 dark:border-zinc-800">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <strong>B</strong>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <em>I</em>
      </ToolbarButton>

      <select
        aria-label="Text block"
        value={currentBlock}
        onChange={(event) => changeBlock(event.target.value)}
        className="rounded border border-zinc-300 bg-transparent px-2 py-1 text-sm dark:border-zinc-700"
      >
        <option value="paragraph">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        • List
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        1. List
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        active={editor.isActive("taskList")}
      >
        ☑ Tasks
      </ToolbarButton>

      <label className="flex items-center gap-1 text-sm">
        Color
        <input
          type="color"
          aria-label="Text color"
          onChange={(event) =>
            editor.chain().focus().setColor(event.target.value).run()
          }
          className="h-7 w-7 cursor-pointer rounded border border-zinc-300 dark:border-zinc-700"
        />
      </label>

      <select
        aria-label="Font weight"
        onChange={(event) => {
          const value = event.target.value;
          if (value === "normal") {
            editor.chain().focus().unsetFontWeight().run();
          } else {
            editor.chain().focus().setFontWeight(value).run();
          }
        }}
        className="rounded border border-zinc-300 bg-transparent px-2 py-1 text-sm dark:border-zinc-700"
      >
        <option value="normal">Weight: normal</option>
        <option value="500">Weight: 500</option>
        <option value="700">Weight: 700</option>
      </select>
    </div>
  );
}
