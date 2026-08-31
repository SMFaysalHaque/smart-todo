import { type JSONContent } from "@tiptap/react";

// Returns a copy of a Tiptap document with every task-list item marked checked.
// Used when a whole todo is marked complete: all of its checkboxes get ticked
// (and the CSS then shows their text with a strikethrough).
export function checkAllTaskItems(node: JSONContent): JSONContent {
  const result: JSONContent = { ...node };

  if (result.type === "taskItem") {
    result.attrs = { ...result.attrs, checked: true };
  }

  if (result.content) {
    result.content = result.content.map(checkAllTaskItems);
  }

  return result;
}
