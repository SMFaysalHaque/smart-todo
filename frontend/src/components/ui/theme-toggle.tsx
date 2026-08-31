"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Switches between light and dark. next-themes only knows the real (resolved)
// theme after the component mounts on the client, so we wait for `mounted` to
// avoid a hydration mismatch.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-md px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
