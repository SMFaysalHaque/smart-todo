import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">Smart Todo</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        Write todos with rich-text notes — headings, lists, checkboxes, colors,
        and more.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/todos">
          <Button variant="primary">Go to your todos</Button>
        </Link>
        <Link href="/register">
          <Button variant="secondary">Create an account</Button>
        </Link>
      </div>
    </div>
  );
}
