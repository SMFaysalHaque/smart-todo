"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex max-w-3xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">
          Smart Todo
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isLoading ? null : user ? (
            <>
              <Link href="/todos">
                <Button variant="ghost">Todos</Button>
              </Link>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Register</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
