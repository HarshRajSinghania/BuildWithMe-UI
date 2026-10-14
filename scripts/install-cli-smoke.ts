import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createInstallFixture } from './install-fixture';
import { withProductionServer } from './verification-server';
import { sourceCliConfig, installationProfiles } from '../src/lib/installation';
import { frameworks, type Framework } from '../src/registry/schema';
import { sampleIds, writeConsumer, exerciseConsumer } from './cli-consumer';
const pnpm = process.env.npm_execpath;
if (!pnpm) throw new Error('Run through pnpm.');
const root = process.cwd();
async function run(args: string[], cwd: string) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [pnpm!, ...args], { cwd, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`CLI failed (${code})`)),
    );
  });
}
await withProductionServer(async (url) => {
  const results: unknown[] = [];
  for (const framework of frameworks) {
    const fixture = await createInstallFixture(root, `cli-${framework}-`);
    await fs.writeFile(
      path.join(fixture, 'package.json'),
      JSON.stringify({
        name: `bwm-cli-${framework}`,
        private: true,
        scripts: {
          build:
            framework === 'react'
              ? 'next build'
              : framework === 'vue'
                ? 'nuxt build'
                : 'vite build',
          typecheck:
            framework === 'react'
              ? 'next typegen && tsc --noEmit'
              : framework === 'vue'
                ? 'nuxt typecheck'
                : 'svelte-kit sync && svelte-check --tsconfig ./tsconfig.json',
        },
        type: 'module',
        dependencies:
          framework === 'react'
            ? { next: '16.3.8', react: '19.3.0', 'react-dom': '19.3.0' }
            : framework === 'vue'
              ? { nuxt: '4.5.2', vue: '3.5.43' }
              : {
                  svelte: '5.57.1',
                  '@sveltejs/kit': '2.70.3',
                  '@sveltejs/adapter-auto': '7.0.1',
                  vite: '8.3.1',
                  '@sveltejs/vite-plugin-svelte': '7.3.1',
                },
        devDependencies: {
          typescript: '5.9.3',
          '@types/node': '22.19.1',
          ...(framework === 'react'
            ? { '@types/react': '19.2.7', '@types/react-dom': '19.2.3' }
            : framework === 'vue'
              ? { 'vue-tsc': '3.3.11' }
              : { 'svelte-check': '4.4.2' }),
        },
      }),
    );
    await fs.mkdir(path.join(fixture, 'src'), { recursive: true });
    await fs.writeFile(path.join(fixture, 'src', 'app.css'), '');
    await fs.writeFile(
      path.join(fixture, 'tsconfig.json'),
      JSON.stringify({ compilerOptions: { baseUrl: '.', paths: { '@/*': ['./src/*'] } } }),
    );
    await fs.writeFile(
      path.join(fixture, 'components.json'),
      JSON.stringify(sourceCliConfig(framework)),
    );
    await run(['install', '--no-frozen-lockfile'], fixture);
    const installedItems: {
      files: { target: string; content: string }[];
      dependencies: string[];
    }[] = [];
    for (const id of sampleIds) {
      const itemUrl = `${url}/r/${framework}/${id}.json`;
      const item = (await (await fetch(itemUrl)).json()) as {
        files: { target: string; content: string }[];
        dependencies: string[];
      };
      await run(['dlx', 'shadcn@latest', 'add', itemUrl, '--yes', '--cwd', fixture], fixture);
      for (const file of item.files) {
        const installed = await fs.readFile(path.join(fixture, 'src', file.target), 'utf8');
        assert.ok(installed.trim(), `Missing CLI-installed ${file.target}`);
        if (/LICENSE|NOTICES/.test(file.target))
          assert.equal(installed.trim(), file.content.trim());
        assert.ok(!installed.includes('../../shared/'), 'Workspace import leaked into CLI output');
      }
      const pkg = JSON.parse(await fs.readFile(path.join(fixture, 'package.json'), 'utf8'));
      for (const dependency of item.dependencies) {
        const specifier = dependency.startsWith('@')
          ? dependency.slice(0, dependency.indexOf('@', 1))
          : dependency.split('@')[0];
        assert.ok(pkg.dependencies[specifier], `Missing CLI dependency ${specifier}`);
      }
      installedItems.push(item);
    }
    await writeConsumer(fixture, framework);
    const destination = installationProfiles[framework].destination;
    const validateClosure = async () => {
      for (const item of installedItems) {
        for (const file of item.files) {
          const relative = file.target.replace(/^components\/buildwithme\//, '');
          const installed = await fs.readFile(path.join(fixture, destination, relative), 'utf8');
          assert.ok(installed.trim(), `Missing installed ${relative}`);
          if (/LICENSE|NOTICES/.test(relative)) assert.equal(installed.trim(), file.content.trim());
        }
      }
    };
    await validateClosure();
    // Prove the gate fails for incomplete closures and misplaced component folders.
    const helper = path.join(fixture, destination, 'animated-tabs', 'motion-lifecycle.ts');
    const original = await fs.readFile(helper);
    await fs.unlink(helper);
    try {
      await assert.rejects(validateClosure(), /ENOENT/);
    } finally {
      await fs.writeFile(helper, original);
    }
    const folder = path.join(fixture, destination, 'animated-tabs');
    await fs.rename(folder, `${folder}-misplaced`);
    try {
      await assert.rejects(validateClosure(), /ENOENT/);
    } finally {
      await fs.rename(`${folder}-misplaced`, folder);
    }
    await run(['typecheck'], fixture);
    await run(['build'], fixture);
    await exerciseConsumer(fixture, framework as Framework);
    results.push({
      framework,
      components: sampleIds,
      files: installedItems.reduce((sum, item) => sum + item.files.length, 0),
      destination,
      fixture,
      typecheck: true,
      build: true,
      interactions: true,
      negativeChecks: true,
      passed: true,
    });
  }
  await fs.writeFile(
    path.join(root, 'tmp', 'install-cli-result.json'),
    JSON.stringify(results, null, 2),
  );
  console.log(
    'PASS: CLI-installed source passed closure checks, negative checks, types, builds and Chromium interactions in Next.js, Nuxt and SvelteKit.',
  );
});
