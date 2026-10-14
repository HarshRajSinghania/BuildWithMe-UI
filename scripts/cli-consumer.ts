import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium, expect } from '@playwright/test';
import type { Framework } from '../src/registry/schema';
import { installationProfiles } from '../src/lib/installation';
import { withProductionServer } from './verification-server';

export const sampleIds = ['animated-tabs', 'magnetic-button', 'code-snippet'] as const;

export async function writeConsumer(fixture: string, framework: Framework) {
  const write = async (name: string, content: string) => {
    await fs.mkdir(path.dirname(path.join(fixture, name)), { recursive: true });
    await fs.writeFile(path.join(fixture, name), content);
  };
  const profile = installationProfiles[framework];
  if (framework !== 'react') {
    await fs.mkdir(path.join(fixture, profile.destination), { recursive: true });
    for (const id of sampleIds) {
      await fs.rename(
        path.join(fixture, 'src/components/buildwithme', id),
        path.join(fixture, profile.destination, id),
      );
    }
  }
  const imports = sampleIds
    .map((id, index) => {
      const name = ['AnimatedTabs', 'MagneticButton', 'CodeSnippet'][index];
      const extension =
        framework === 'react' ? 'react' : framework === 'vue' ? 'vue.vue' : 'svelte.svelte';
      return `import ${name} from '${profile.alias}/components/buildwithme/${id}/${extension}';`;
    })
    .join('\n');
  const items =
    "[{id:'overview',label:'Overview',content:'Installed overview'},{id:'activity',label:'Activity',content:'Installed activity'}]";
  if (framework === 'react') {
    await write(
      'src/app/layout.tsx',
      'export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}',
    );
    await write(
      'src/app/page.tsx',
      `'use client';\nimport {useState} from 'react';\n${imports}\nexport default function Page(){const [tab,setTab]=useState('overview');const [clicks,setClicks]=useState(0);return <main data-bwm-theme="dark"><h1>CLI consumer</h1><AnimatedTabs items={${items}} value={tab} onValueChange={setTab}/><output aria-label="Selected tab">{tab}</output><MagneticButton label="Installed action" onClick={()=>setClicks(clicks+1)}/><output aria-label="Action clicks">{clicks}</output><CodeSnippet label="Installed code"/></main>}`,
    );
    await write('next.config.mjs', 'export default {turbopack:{root:process.cwd()}};');
    await write(
      'tsconfig.json',
      JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          lib: ['dom', 'esnext'],
          strict: true,
          noEmit: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          skipLibCheck: true,
          paths: { '@/*': ['./src/*'] },
          plugins: [{ name: 'next' }],
        },
        include: ['**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      }),
    );
  } else if (framework === 'vue') {
    await write(
      'nuxt.config.ts',
      "export default defineNuxtConfig({devtools:{enabled:false},compatibilityDate:'2026-09-26'});",
    );
    await write('tsconfig.json', JSON.stringify({ extends: './.nuxt/tsconfig.json' }));
    await write(
      'app/app.vue',
      `<script setup lang="ts">import {ref} from 'vue';\n${imports}\nconst items=${items};const tab=ref('overview');const clicks=ref(0);</script><template><main data-bwm-theme="dark"><h1>CLI consumer</h1><AnimatedTabs :items="items" v-model:value="tab"/><output aria-label="Selected tab">{{tab}}</output><MagneticButton label="Installed action" @click="clicks++"/><output aria-label="Action clicks">{{clicks}}</output><CodeSnippet label="Installed code"/></main></template>`,
    );
  } else {
    await write(
      'svelte.config.js',
      "import adapter from '@sveltejs/adapter-auto';export default {kit:{adapter:adapter()}};",
    );
    await write(
      'vite.config.ts',
      "import {sveltekit} from '@sveltejs/kit/vite';import {defineConfig} from 'vite';export default defineConfig({plugins:[sveltekit()]});",
    );
    await write(
      'tsconfig.json',
      JSON.stringify({
        extends: './.svelte-kit/tsconfig.json',
        compilerOptions: {
          allowJs: true,
          checkJs: true,
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          resolveJsonModule: true,
          skipLibCheck: true,
          sourceMap: true,
          strict: true,
          moduleResolution: 'bundler',
        },
      }),
    );
    await write(
      'src/app.html',
      '<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/>%sveltekit.head%</head><body><div style="display:contents">%sveltekit.body%</div></body></html>',
    );
    await write(
      'src/routes/+page.svelte',
      `<script lang="ts">${imports}\nconst items=${items};let tab=$state('overview');let clicks=$state(0);</script><main data-bwm-theme="dark"><h1>CLI consumer</h1><AnimatedTabs {items} value={tab} onValueChange={(value)=>tab=value}/><output aria-label="Selected tab">{tab}</output><MagneticButton label="Installed action" onClick={()=>clicks++}/><output aria-label="Action clicks">{clicks}</output><CodeSnippet label="Installed code"/></main>`,
    );
  }
}

export async function exerciseConsumer(fixture: string, framework: Framework) {
  const require = createRequire(path.join(fixture, 'package.json'));
  const browser = await chromium.launch();
  try {
    await withProductionServer(
      async (url) => {
        const context = await browser.newContext({ reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        // Portable clipboard stub verifies the component's payload and failure recovery.
        await page.addInitScript(
          `Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText(text) { window.copiedText = text; return Promise.resolve(); } } });`,
        );
        await page.goto(url);
        await expect(page.getByRole('tabpanel')).toHaveText('Installed overview');
        await page.getByRole('tab', { name: 'Overview' }).press('End');
        await expect(page.getByRole('tab', { name: 'Activity' })).toBeFocused();
        await expect(page.getByLabel('Selected tab')).toHaveText('activity');
        await expect(page.getByRole('tabpanel')).toHaveText('Installed activity');
        await page.getByRole('button', { name: 'Installed action' }).click();
        await expect(page.getByLabel('Action clicks')).toHaveText('1');
        await page.getByRole('button', { name: 'Copy source' }).click();
        await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
        const copied = await page.evaluate(
          () => (window as unknown as { copiedText: string }).copiedText,
        );
        expect(copied).toContain('import AnimatedTabs');
        await page.reload();
        await page.evaluate(
          `navigator.clipboard.writeText = function() { return Promise.reject(new Error('Clipboard unavailable')); };`,
        );
        await page.getByRole('button', { name: 'Copy source' }).click();
        await expect(page.getByRole('textbox')).toHaveValue(/import AnimatedTabs/);
        expect(
          await page
            .locator('.bw-demo')
            .first()
            .evaluate((node) => getComputedStyle(node).display),
        ).toBe('flex');
        expect(errors).toEqual([]);
        await context.close();
      },
      {
        cwd: fixture,
        args: (port) =>
          framework === 'react'
            ? [
                require.resolve('next/dist/bin/next'),
                'start',
                '--hostname',
                '127.0.0.1',
                '--port',
                String(port),
              ]
            : framework === 'vue'
              ? ['.output/server/index.mjs']
              : [
                  path.join(path.dirname(require.resolve('vite/package.json')), 'bin/vite.js'),
                  'preview',
                  '--host',
                  '127.0.0.1',
                  '--port',
                  String(port),
                ],
      },
    );
  } finally {
    await browser.close();
  }
}
