import net from 'node:net';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
/** Own a disposable production server; never reuse an unknown local process. */
export async function withProductionServer<T>(
  verify: (url: string) => Promise<T>,
  options?: { cwd: string; args: (port: number) => string[] },
): Promise<T> {
  const socket = net.createServer();
  await new Promise<void>((resolve, reject) => {
    socket.once('error', reject);
    socket.listen(0, '127.0.0.1', resolve);
  });
  const address = socket.address();
  if (!address || typeof address === 'string') throw new Error('No verification port');
  await new Promise<void>((resolve, reject) =>
    socket.close((error) => (error ? reject(error) : resolve())),
  );
  const url = `http://127.0.0.1:${address.port}`;
  const child = spawn(
    process.execPath,
    options?.args(address.port) ?? [
      require.resolve('next/dist/bin/next'),
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      String(address.port),
    ],
    {
      cwd: options?.cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: '1',
        PORT: String(address.port),
        HOST: '127.0.0.1',
        NITRO_PORT: String(address.port),
        NITRO_HOST: '127.0.0.1',
      },
    },
  );
  let diagnostics = '';
  child.stdout.on('data', (chunk) => {
    diagnostics = (diagnostics + chunk).slice(-2000);
  });
  child.stderr.on('data', (chunk) => {
    diagnostics = (diagnostics + chunk).slice(-2000);
  });
  let failure: Error | undefined;
  child.once('error', (error) => {
    failure = error;
  });
  try {
    const deadline = Date.now() + 60000;
    while (true) {
      if (failure || child.exitCode !== null)
        throw failure ?? new Error(`Verification server exited: ${diagnostics}`);
      try {
        if ((await fetch(url, { signal: AbortSignal.timeout(2000) })).ok) break;
      } catch {
        /* Startup is not ready. */
      }
      if (Date.now() > deadline)
        throw new Error(`Verification server startup timed out: ${diagnostics}`);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return await verify(url);
  } finally {
    child.kill();
  }
}
