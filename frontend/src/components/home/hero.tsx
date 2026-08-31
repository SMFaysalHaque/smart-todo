import Link from "next/link";

// Static, product-inspired visual — NOT a working todo demo. It's a stylized
// "note card" made of plain divs that hints at the rich-text editor.
function HeroCard() {
  return (
    <div
      aria-hidden
      className="float-slow w-full max-w-sm rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <div className="ml-3 flex gap-1.5">
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-bold dark:bg-zinc-700">
            B
          </span>
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] italic dark:bg-zinc-700">
            i
          </span>
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] dark:bg-zinc-700">
            H1
          </span>
        </div>
      </div>

      <div className="mb-3 h-4 w-2/3 rounded bg-zinc-300 dark:bg-zinc-600" />

      <div className="mb-3 flex items-center gap-2">
        <span className="rounded bg-gradient-to-r from-blue-500 to-violet-500 px-2 py-0.5 text-xs font-semibold text-white">
          Rich text
        </span>
        <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>

      <div className="space-y-2">
        <div className="h-2.5 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-2.5 w-5/6 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="grid h-4 w-4 place-items-center rounded border border-blue-500 bg-blue-500 text-[10px] text-white">
            ✓
          </span>
          <div className="h-2.5 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded border border-zinc-400 dark:border-zinc-500" />
          <div className="h-2.5 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative animated background blobs. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob absolute -left-16 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/30 to-violet-400/30 blur-3xl dark:from-blue-600/20 dark:to-violet-600/20" />
        <div
          className="blob absolute right-0 top-24 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-400/25 to-sky-400/25 blur-3xl dark:from-indigo-600/15 dark:to-sky-600/15"
          style={{ animationDelay: "-6s" }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Full-stack portfolio project
          </span>

          <h1
            className="animate-fade-up mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="gradient-text">Smart Todo</span>
          </h1>

          <p
            className="animate-fade-up mt-4 max-w-md text-lg text-zinc-600 dark:text-zinc-300"
            style={{ animationDelay: "0.12s" }}
          >
            A full-stack task manager with a rich-text editor, secure JWT
            authentication, and per-user data ownership — built to demonstrate
            real engineering, not a template.
          </p>

          <div
            className="animate-fade-up mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get Started
            </Link>
            <Link
              href="/todos"
              className="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Explore the App
            </Link>
          </div>
        </div>

        <div
          className="animate-fade-up md:justify-self-end"
          style={{ animationDelay: "0.15s" }}
        >
          <HeroCard />
        </div>
      </div>
    </section>
  );
}
