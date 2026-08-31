import { SectionHeading } from "./section-heading";
import {
  BrowserIcon,
  CodeIcon,
  BoltIcon,
  ShieldIcon,
  CheckCircleIcon,
  ServerIcon,
  DatabaseIcon,
} from "./icons";

// A simple, honest representation of how a request actually flows through the
// real application.
const STEPS = [
  { icon: BrowserIcon, label: "Browser", detail: "User interacts with the UI" },
  { icon: CodeIcon, label: "Next.js frontend", detail: "React components & pages" },
  { icon: BoltIcon, label: "Central API client", detail: "src/lib/api-client.ts" },
  { icon: ServerIcon, label: "Express.js API", detail: "REST routes" },
  { icon: ShieldIcon, label: "Auth middleware", detail: "Verifies the JWT" },
  { icon: CheckCircleIcon, label: "Zod validation", detail: "Checks the request data" },
  { icon: DatabaseIcon, label: "MongoDB / Mongoose", detail: "Owner-scoped queries" },
];

export function ArchitectureSection() {
  return (
    <section className="border-t border-zinc-100 py-20 dark:border-zinc-900">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Architecture"
          title="How a request flows"
          subtitle="From a click in the browser to an owner-scoped database query."
        />

        <ol className="mx-auto mt-12 flex max-w-md flex-col items-stretch gap-0">
          {STEPS.map((step, index) => (
            <li key={step.label} className="reveal">
              <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <step.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{step.label}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {step.detail}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div aria-hidden className="flex justify-center">
                  <span className="h-6 w-px bg-gradient-to-b from-blue-400 to-transparent" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
