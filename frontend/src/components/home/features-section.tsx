import { SectionHeading } from "./section-heading";
import {
  ShieldIcon,
  EditIcon,
  GridIcon,
  CheckCircleIcon,
  FunnelIcon,
  LayersIcon,
  UserIcon,
  DeviceIcon,
  MoonIcon,
} from "./icons";

// Only features that actually exist in the project are listed here.
const FEATURES = [
  {
    icon: ShieldIcon,
    title: "Secure authentication",
    description:
      "Register and sign in with JWT access tokens; passwords are hashed with bcrypt on the server.",
  },
  {
    icon: GridIcon,
    title: "Full Todo CRUD",
    description:
      "Create, read, edit, and delete todos through a clean REST API.",
  },
  {
    icon: CheckCircleIcon,
    title: "Complete / incomplete",
    description:
      "Toggle a todo's status; the UI stays in sync with the backend after every change.",
  },
  {
    icon: FunnelIcon,
    title: "Filtering",
    description:
      "Filter by All, Active, or Completed — the query runs on the backend, not in the browser.",
  },
  {
    icon: LayersIcon,
    title: "Pagination",
    description:
      "Database-level pagination with Previous / Next controls and accurate page counts.",
  },
  {
    icon: UserIcon,
    title: "Per-user ownership",
    description:
      "Every todo is scoped to the authenticated user's ID on the backend — you only ever see your own.",
  },
  {
    icon: DeviceIcon,
    title: "Responsive UI",
    description:
      "Works across mobile, tablet, and desktop with a layout that adapts cleanly.",
  },
  {
    icon: MoonIcon,
    title: "Light & dark theme",
    description:
      "A system-aware theme toggle powered by next-themes, remembered across visits.",
  },
];

const EDITOR_CAPABILITIES = [
  "Bold",
  "Italic",
  "Headings",
  "Bullet lists",
  "Ordered lists",
  "Task lists",
  "Text color",
  "Font weight",
];

export function FeaturesSection() {
  return (
    <section className="border-t border-zinc-100 py-20 dark:border-zinc-900">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to manage tasks"
          subtitle="A focused feature set, each backed by real code in the repository."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Rich-text editor gets a wider highlight card. */}
          <article className="reveal rounded-xl border border-zinc-200 p-6 transition hover:-translate-y-1 hover:shadow-lg sm:col-span-2 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <EditIcon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold">Rich-text Todo editor</h3>
            </div>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
              Todo notes are edited with Tiptap and stored as structured JSON —
              validated by the backend and rendered back exactly as written.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {EDITOR_CAPABILITIES.map((capability) => (
                <li
                  key={capability}
                  className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
                >
                  {capability}
                </li>
              ))}
            </ul>
          </article>

          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="reveal rounded-xl border border-zinc-200 p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
