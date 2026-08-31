import { SectionHeading } from "./section-heading";
import { CheckCircleIcon } from "./icons";

const HIGHLIGHTS = [
  "JWT-based authentication with short-lived access tokens",
  "Passwords hashed with bcrypt — never stored in plain text",
  "Secrets kept in environment variables, out of source control",
  "Zod validation at every API boundary",
  "A single centralized API client on the frontend",
  "Feature-based frontend architecture",
  "Express middleware that verifies auth before protected routes",
  "User-specific Todo ownership enforced in the database query",
  "Pagination, filtering, and sorting done at the database level",
  "Whitelisted sort fields to prevent arbitrary queries",
  "A MongoDB index on the todo owner for fast lookups",
  "Tiptap JSON as the single source of truth for rich text",
  "One shared Tiptap configuration reused by editor and preview",
  "Clean separation between the frontend and backend apps",
  "Strict TypeScript across the whole project",
];

export function EngineeringSection() {
  return (
    <section className="border-t border-zinc-100 py-20 dark:border-zinc-900">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Engineering highlights"
          title="Decisions that show the thinking"
          subtitle="The details a reviewer cares about — security, validation, structure, and type safety."
        />
        <ul className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
          {HIGHLIGHTS.map((point) => (
            <li
              key={point}
              className="reveal flex items-start gap-3 rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800"
            >
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
              <span className="text-zinc-700 dark:text-zinc-200">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
