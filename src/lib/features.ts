export type Feature = {
  title: string;
  description: string;
  accent?: string;
};

export const features: Feature[] = [
  {
    title: "Fast scaffolding",
    description: "Bootstrap features with reusable components and Tailwind tokens.",
    accent: "velocity"
  },
  {
    title: "Type-safe paths",
    description: "Import from '@/': shared UI, lib utilities, and server routes stay organized.",
    accent: "safety"
  },
  {
    title: "Runtime ready",
    description: "App Router defaults with sensible metadata, strict linting, and test hooks.",
    accent: "stability"
  }
];
