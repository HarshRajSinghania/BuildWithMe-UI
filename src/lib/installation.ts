import type { Framework } from '../registry/schema';

export type InstallationProfile = {
  title: string;
  prerequisite: string;
  placement: string;
  destination: string;
  alias: string;
};

export const installationProfiles: Record<Framework, InstallationProfile> = {
  react: {
    title: 'React / Next.js',
    prerequisite:
      'Use an existing Next.js App Router application with React and TypeScript. Configure @/ to resolve to src/.',
    placement:
      'Keep the complete installed folder in src/components/buildwithme. Interactive components retain use client; put application state and event handlers in a client component.',
    destination: 'src/components/buildwithme',
    alias: '@',
  },
  vue: {
    title: 'Vue / Nuxt',
    prerequisite:
      'Use an existing Nuxt 4 application with Vue 3 and TypeScript. The ~/ alias resolves to app/ in the documented default layout.',
    placement:
      'The handbook CLI configuration delivers files into src/components/buildwithme. Move each complete component folder into app/components/buildwithme, then import it explicitly through ~/. Preserve existing Nuxt aliases and adapt the destination if your srcDir differs.',
    destination: 'app/components/buildwithme',
    alias: '~',
  },
  svelte: {
    title: 'Svelte / SvelteKit',
    prerequisite:
      'Use an existing SvelteKit application with Svelte 5 and TypeScript. The $lib alias resolves to src/lib/.',
    placement:
      'The handbook CLI configuration delivers files into src/components/buildwithme. Move each complete component folder into src/lib/components/buildwithme, then import it through $lib. Preserve your existing SvelteKit configuration.',
    destination: 'src/lib/components/buildwithme',
    alias: '$lib',
  },
};

/** Transport configuration for our explicit file targets, not a framework scaffold. */
export function sourceCliConfig(framework: Framework) {
  return {
    $schema: 'https://ui.shadcn.com/schema.json',
    style: 'new-york',
    rsc: framework === 'react',
    tsx: true,
    tailwind: { config: '', css: 'src/app.css', baseColor: 'neutral', cssVariables: true },
    aliases: {
      components: '@/components',
      utils: '@/lib/utils',
      ui: '@/components/ui',
      lib: '@/lib',
      hooks: '@/hooks',
    },
  };
}

export function sourceInstallCommand(site: string, framework: Framework, id: string) {
  return `pnpm dlx shadcn@latest add ${site.replace(/\/$/, '')}/r/${framework}/${id}.json`;
}
