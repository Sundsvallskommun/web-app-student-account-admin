import { exec } from 'child_process';
import path from 'path';
import fs from 'node:fs';
import yaml from 'js-yaml';

import { APIS, API_BASE_URL } from './config/index';

const PATH_TO_OUTPUT_DIR = path.resolve(process.cwd(), './src/data-contracts');

const stdout = (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`Data-contract-generator: ${stdout}`);
};

const execAsync = (cmd: string): Promise<void> =>
  new Promise(resolve => {
    exec(cmd, (error, out, err) => {
      stdout(error, out, err);
      resolve();
    });
  });

/**
 * The Sundsvall gateway serves some `/api-docs` endpoints as raw JSON, others
 * as YAML, and a few (e.g. education) as a JSON-encoded *string* that wraps a
 * YAML document. Normalise all of those into clean JSON that
 * swagger-typescript-api can consume regardless of source format.
 */
const normalizeSpec = (raw: string): string => {
  let body: unknown = raw;

  // Unwrap a JSON-encoded string body (e.g. "\"openapi: 3.0.4\\n...\"").
  try {
    const parsed = JSON.parse(raw);
    body = parsed;
  } catch {
    /* not JSON – treat as YAML/text below */
  }

  // If we still have a string (raw YAML, or the unwrapped inner doc), parse it.
  if (typeof body === 'string') {
    body = yaml.load(body);
  }

  return JSON.stringify(body, null, 2);
};

const main = async () => {
  console.log('Downloading and generating api-docs..');

  for (const api of APIS) {
    const outDir = `${PATH_TO_OUTPUT_DIR}/${api.name}`;
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const specUrl = `${API_BASE_URL}/${api.name}/${api.version}/api-docs`;
    try {
      const res = await fetch(specUrl, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        console.log(`- SKIP ${api.name} ${api.version} (HTTP ${res.status} from ${specUrl})`);
        continue;
      }
      const spec = normalizeSpec(await res.text());
      fs.writeFileSync(`${outDir}/swagger.json`, spec);
      console.log(`- ${api.name} ${api.version}`);

      await execAsync(
        `npx swagger-typescript-api generate --modular -p ${outDir}/swagger.json -o ${outDir} --no-client --clean-output --extract-enums`,
      );
    } catch (e) {
      console.log(`- FAILED ${api.name} ${api.version}: ${(e as Error).message}`);
    }
  }
};

main();
