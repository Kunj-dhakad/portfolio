'use client';
import { ThemeProvider } from 'next-themes';
import { ExperienceEffects } from '@/components/layout/experience-effects';
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      storageKey="navonixx-theme"
      enableSystem={false}
    >
      <ExperienceEffects />
      {children}
    </ThemeProvider>
  );
}
