"use client";

import { type TodoFilter } from "../types";


const OPTIONS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function TodoFilterBar({
  value,
  onChange,
}: {
  value: TodoFilter;
  onChange: (filter: TodoFilter) => void;
}) {
  return (
    <div className="flex gap-1" role="group" aria-label="Filter todos">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-md px-3 py-1 text-sm ${
            value === option.value
              ? "bg-blue-600 text-white"
              : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
