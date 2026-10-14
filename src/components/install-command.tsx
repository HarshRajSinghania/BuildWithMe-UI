'use client';
import { useState } from 'react';
import { CopyButton } from './copy-button';
import type { Framework } from '@/registry/schema';
import Link from 'next/link';
import { installationProfiles, sourceInstallCommand } from '@/lib/installation';

const packages: Record<Framework, string> = {
  react: '@buildwithme/react',
  vue: '@buildwithme/vue',
  svelte: '@buildwithme/svelte',
};
export function ComponentInstall({
  id,
  site,
  framework: controlledFramework,
  onFrameworkChange,
  usage,
  files = [],
}: {
  id: string;
  site: string;
  framework?: Framework;
  onFrameworkChange?: (framework: Framework) => void;
  usage?: string;
  files?: string[];
}) {
  const [localFramework, setLocalFramework] = useState<Framework>('react');
  const framework = controlledFramework ?? localFramework;
  const setFramework = onFrameworkChange ?? setLocalFramework;
  const [method, setMethod] = useState<'npm' | 'source'>('source');
  const origin = site || 'https://build-with-me-ui.vercel.app';
  const command =
    method === 'npm'
      ? `pnpm add ${packages[framework]}`
      : sourceInstallCommand(origin, framework, id);
  const profile = installationProfiles[framework];
  return (
    <div className="component-install">
      {!controlledFramework ? (
        <div className="source-tabs" aria-label="Installation framework">
          {(['react', 'vue', 'svelte'] as const).map((item) => (
            <button key={item} aria-pressed={framework === item} onClick={() => setFramework(item)}>
              {item}
            </button>
          ))}
        </div>
      ) : null}
      <div className="source-tabs" aria-label="Installation method">
        <button aria-pressed={method === 'npm'} aria-disabled="true" disabled>
          npm · unpublished
        </button>
        <button aria-pressed={method === 'source'} onClick={() => setMethod('source')}>
          own the source
        </button>
      </div>
      <div className="source-toolbar">
        <code tabIndex={0}>{command}</code>
        <CopyButton key={command} text={command} label="Copy command" />
      </div>
      {usage !== undefined ? (
        <>
          <p className="install-prerequisite">{profile.prerequisite}</p>
          <Link href={`/docs/installation#${framework}`}>Set up {profile.title} →</Link>
          <details className="install-guidance">
            <summary>File placement and first usage</summary>
            <p>{profile.placement}</p>
            <p>
              Keep all helpers, CSS, artwork modules, LICENSE and notices with the component. Its
              styles are imported by the source.
            </p>
            {files.length ? (
              <ul className="install-file-list" aria-label="Installed source files">
                {files.map((file) => (
                  <li key={file}>
                    <code>{file}</code>
                  </li>
                ))}
              </ul>
            ) : null}
            {usage ? (
              <>
                <pre tabIndex={0}>
                  <code>{usage}</code>
                </pre>
                <CopyButton key={usage} text={usage} label="Copy first usage" />
              </>
            ) : null}
            <p>
              Use a data-bwm-theme="dark" or "light" boundary for the component theme. Adapt the
              import if your project uses a different alias or directory.
            </p>
          </details>
        </>
      ) : null}
    </div>
  );
}
