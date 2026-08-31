"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { CreateTodoForm } from "@/features/todos/components/create-todo-form";

// Protected page. Because the access token lives on the client, we guard here:
// while auth is loading we show nothing; once we know there is no user we send
// them to the sign-in page. Only an authenticated user sees the editor.
export default function TodosPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-8 text-sm">Loading…</p>;
  }

  if (!user) {
    // Redirect is in flight; render nothing to avoid a flash of the editor.
    return null;
  }

  return <CreateTodoForm />;
}
