import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { FontWeight } from "./extensions/font-weight";

export const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

export function getTodoEditorExtensions() {
  return [
    StarterKit.configure({
      strike: false,
      code: false,
      codeBlock: false,
      blockquote: false,
      horizontalRule: false,
    }),
    TextStyle,
    Color.configure({ types: ["textStyle"] }),
    FontWeight,
    TaskList,
    TaskItem.configure({ nested: true }),
  ];
}
