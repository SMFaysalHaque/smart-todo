import { type JSONContent } from "@tiptap/react";

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
