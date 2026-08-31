"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";

// Wraps next-themes. `attribute="class"` makes it add a `dark` class on <html>,
// which our Tailwind dark: styles key off. `enableSystem` respects the OS
// setting when the user hasn't chosen a theme.
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
