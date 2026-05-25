#!/usr/bin/env node
/**
 * Sync CI secrets/variables from .env to GitHub Actions.
 * Requires GITHUB_TOKEN (repo scope) or `gh auth login`.
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_xxx node scripts/setup-github-secrets.mjs
 *   # or after: gh auth login
 *   node scripts/setup-github-secrets.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const owner = 'mouhamedfs';
const repo = 'sauceDemoE2EDoctest';

const SECRETS = ['BASE_URL', 'TEST_USER_EMAIL', 'TEST_USER_PASSWORD', 'DOCTEST_PROJECT_TOKEN'];
const VARIABLES = ['DOCTEST_API_URL'];

function loadEnv() {
  const envPath = resolve(root, '.env');
  const vars = {};
  if (!existsSync(envPath)) {
    console.error('[setup-github-secrets] Missing .env at project root');
    process.exit(1);
  }
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execSync('gh auth token', { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

async function ghApi(path, { method = 'GET', body } = {}, token) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function encryptSecret(publicKey, secretValue) {
  const sodium = (await import('tweetsodium')).default;
  const messageBytes = Buffer.from(secretValue, 'utf8');
  const keyBytes = Buffer.from(publicKey, 'base64');
  const encryptedBytes = sodium.seal(messageBytes, keyBytes);
  return Buffer.from(encryptedBytes).toString('base64');
}

async function setSecret(name, value, token) {
  const { key_id, key } = await ghApi(
    `/repos/${owner}/${repo}/actions/secrets/public-key`,
    {},
    token,
  );
  const encrypted_value = await encryptSecret(key, value);
  await ghApi(
    `/repos/${owner}/${repo}/actions/secrets/${name}`,
    {
      method: 'PUT',
      body: { encrypted_value, key_id },
    },
    token,
  );
  console.log(`[setup-github-secrets] secret ${name} ✓`);
}

async function setVariable(name, value, token) {
  await ghApi(
    `/repos/${owner}/${repo}/actions/variables/${name}`,
    {
      method: 'PATCH',
      body: { name, value },
    },
    token,
  ).catch(async () => {
    await ghApi(
      `/repos/${owner}/${repo}/actions/variables`,
      {
        method: 'POST',
        body: { name, value },
      },
      token,
    );
  });
  console.log(`[setup-github-secrets] variable ${name} ✓`);
}

async function main() {
  const token = getToken();
  if (!token) {
    console.error(
      '[setup-github-secrets] Set GITHUB_TOKEN or run `gh auth login` (scopes: repo, admin:repo_hook for secrets).',
    );
    process.exit(1);
  }

  const env = loadEnv();

  for (const name of SECRETS) {
    const value = env[name]?.trim();
    if (!value) {
      console.warn(`[setup-github-secrets] skip ${name} (empty in .env)`);
      continue;
    }
    await setSecret(name, value, token);
  }

  for (const name of VARIABLES) {
    const value = env[name]?.trim();
    if (!value) {
      console.warn(`[setup-github-secrets] skip variable ${name} (empty in .env)`);
      continue;
    }
    await setVariable(name, value, token);
  }

  console.log('[setup-github-secrets] done');
}

main().catch((err) => {
  console.error('[setup-github-secrets]', err.message);
  process.exit(1);
});
