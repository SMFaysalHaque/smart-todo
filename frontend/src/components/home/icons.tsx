
type IconProps = { className?: string };

function base(className?: string) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function EditIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M4 20h4L18 10l-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}

export function FunnelIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
    </svg>
  );
}

export function LayersIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function DeviceIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="4" width="13" height="10" rx="2" />
      <path d="M16 9h5v9a2 2 0 0 1-2 2h-8" />
      <path d="M8 20h4" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M20 14a8 8 0 1 1-10-10 6.5 6.5 0 0 0 10 10z" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function DatabaseIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  );
}

export function ServerIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </svg>
  );
}

export function CodeIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
    </svg>
  );
}

export function BrowserIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M6.5 6.5h.01M9 6.5h.01" />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}
