import { spawn } from 'node:child_process';

const port = process.env.PORT || '8080';
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const child = spawn(command, ['astro', 'preview', '--host', '0.0.0.0', '--port', port], {
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});