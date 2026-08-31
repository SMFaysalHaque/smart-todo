"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { TodosManager } from "@/features/todos/components/todos-manager";

// Protected page. Because the access token lives on the client, we guard here:
// while auth is loading we show nothing useful; once we know there is no user we
// send them to sign in. Only an authenticated user sees the todo manager.
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
    return null; // redirect in flight
  }

  return <TodosManager />;
}
