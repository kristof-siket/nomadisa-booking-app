// Copy the runtime files of the web service into the build output: on
// Compute only the build output is deployed, so the static file server and
// the service declaration it reads must ship beside the assets that
// `react-scripts build` produced.
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const buildDir = path.join(project, 'build');

await mkdir(buildDir, { recursive: true });
for (const file of ['server.mjs', 'service.mjs']) {
  await copyFile(path.join(project, file), path.join(buildDir, file));
}
console.log('Copied server.mjs and service.mjs into build/');
