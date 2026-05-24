#!/usr/bin/env node
/**
 * Upload Playwright reports to Doctest Flakiness Observability.
 * Généré par Doctest — ne pas éditer manuellement sauf besoin spécifique.
 *
 * Usage local :
 *   DOCTEST_PROJECT_TOKEN=my-project npm run upload:doctest
 *
 * Variables d'environnement :
 *   DOCTEST_PROJECT_TOKEN  (requis)
 *   DOCTEST_API_URL        (défaut https://api.doctest.dev)
 *   DOCTEST_BRANCH         (auto-détecté en CI)
 *   DOCTEST_SHA            (auto-détecté en CI)
 *   DOCTEST_ENVIRONMENT    (optionnel)
 *   DOCTEST_BROWSER        (optionnel)
 */

import { readFileSync, existsSync } from 'node:fs';

const projectToken = process.env.DOCTEST_PROJECT_TOKEN?.trim() ?? '';
const apiUrl = (process.env.DOCTEST_API_URL ?? 'https://api.doctest.dev').replace(/\/$/, '');
const branch =
  process.env.DOCTEST_BRANCH ??
  process.env.GITHUB_REF_NAME ??
  process.env.CI_COMMIT_BRANCH ??
  process.env.CIRCLE_BRANCH ??
  process.env.BUILD_SOURCEBRANCHNAME ??
  undefined;
const gitSha =
  process.env.DOCTEST_SHA ??
  process.env.GITHUB_SHA ??
  process.env.CI_COMMIT_SHA ??
  process.env.CIRCLE_SHA1 ??
  process.env.BUILD_SOURCEVERSION ??
  undefined;
const environment = process.env.DOCTEST_ENVIRONMENT ?? undefined;
const browser = process.env.DOCTEST_BROWSER ?? undefined;

const junitPath = 'playwright-report/junit.xml';
const reportPath = 'playwright-report/report.json';

if (!projectToken) {
  console.warn('[doctest-upload] SKIP: DOCTEST_PROJECT_TOKEN not set — configure it in CI secrets or .env');
  process.exit(0);
}

let junitXml;
if (existsSync(junitPath)) {
  junitXml = readFileSync(junitPath, 'utf8');
  console.log('[doctest-upload] Loaded ' + junitPath);
} else {
  console.warn('[doctest-upload] WARN: ' + junitPath + ' not found');
}

let reportJson;
if (existsSync(reportPath)) {
  reportJson = readFileSync(reportPath, 'utf8');
  console.log('[doctest-upload] Loaded ' + reportPath);
} else {
  console.warn('[doctest-upload] WARN: ' + reportPath + ' not found');
}

if (!junitXml && !reportJson) {
  console.warn('[doctest-upload] SKIP: no report files found — run tests first');
  process.exit(0);
}

const payload = {
  projectToken,
  ...(gitSha ? { gitSha } : {}),
  ...(branch ? { branch } : {}),
  ...(environment ? { environment } : {}),
  ...(browser ? { browser } : {}),
  ...(junitXml ? { junitXml } : {}),
  ...(reportJson ? { reportJson } : {}),
};

const RETRY_DELAYS = [2000, 5000, 10000];

async function upload(attempt = 0) {
  try {
    console.log('[doctest-upload] POST ' + apiUrl + '/v1/runs (attempt ' + (attempt + 1) + '/3)');
    const res = await fetch(apiUrl + '/v1/runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error('HTTP ' + res.status + ': ' + text);
    }
    const data = await res.json();
    console.log('[doctest-upload] OK — runId=' + data.runId + ' tests=' + data.testsIngested + ' flaky=' + data.flakyDetected);
    if (data.flakyDetected > 0) {
      console.log('[doctest-upload] Flaky tests detected — check your Doctest dashboard');
    }
  } catch (err) {
    if (attempt < 2) {
      const delay = RETRY_DELAYS[attempt] ?? 5000;
      console.warn('[doctest-upload] Failed (' + err.message + '), retry in ' + delay + 'ms');
      await new Promise((r) => setTimeout(r, delay));
      return upload(attempt + 1);
    }
    console.warn('[doctest-upload] Failed after 3 attempts: ' + err.message);
    process.exit(0);
  }
}

upload();
