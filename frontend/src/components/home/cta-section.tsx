import Link from "next/link";

export function CtaSection() {
  return (
    <section className="px-4 py-20">
      <div className="reveal relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-600 to-violet-600 px-6 py-14 text-center text-white dark:border-zinc-800">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Try Smart Todo
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-blue-50">
          Create an account and start writing rich-text todos in seconds — or
          sign in if you already have one.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
