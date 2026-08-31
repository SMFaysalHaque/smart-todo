import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { FontWeight } from "./extensions/font-weight";

// The one canonical empty document (matches the backend default).
export const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

// Shared list of Tiptap extensions used by BOTH the editable form and the
// read-only preview, so the two always support exactly the same features.
//
// This is a function (not a shared array) because each editor instance needs
// its own fresh extension objects. We only enable what the backend supports;
// unsupported StarterKit features (strike, code, code block, blockquote,
// horizontal rule) are turned off so saved JSON always matches the contract.
// There is deliberately NO image extension.
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
