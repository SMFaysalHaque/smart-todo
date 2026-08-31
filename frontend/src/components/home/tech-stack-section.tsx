import { type ComponentType } from "react";
import { SectionHeading } from "./section-heading";
import { CodeIcon, ServerIcon } from "./icons";

const FRONTEND = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Tiptap",
  "React Hook Form",
  "Zod",
  "next-themes",
];

const BACKEND = [
  "Node.js",
  "Express.js",
  "TypeScript",
  "MongoDB",
  "Mongoose",
  "Zod",
  "JWT",
  "bcrypt",
];

function StackCard({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="reveal rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TechStackSection() {
  return (
    <section className="border-t border-zinc-100 py-20 dark:border-zinc-900">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Tech stack"
          title="Built with a modern, typed stack"
          subtitle="TypeScript end-to-end, with a clear separation between the Next.js frontend and the Express API."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <StackCard title="Frontend" items={FRONTEND} icon={CodeIcon} />
          <StackCard title="Backend" items={BACKEND} icon={ServerIcon} />
        </div>
      </div>
    </section>
  );
}
