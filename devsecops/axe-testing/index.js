import fs from 'fs';
import * as url from 'node:url';

import { AxePuppeteer } from '@axe-core/puppeteer';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';

import { crawlPage } from './src/crawl-page.js';
import { processAxeReport } from './src/process-axe-report.js';

dotenv.config();
const { HOMEPAGE_URL } = process.env;

const config = JSON.parse(fs.readFileSync('./axeignore.json', 'utf8'));
const blacklistPatterns = config.blacklistPatterns || [];
console.log('Exempted URL Patterns:', blacklistPatterns);
const ignoreIncomplete = config.ignoreIncomplete || [];
console.log('Exempted incomplete ids:', ignoreIncomplete);
const ignoreViolations = config.ignoreViolations || [];
console.log('Exempted violation ids:', ignoreViolations);

// Extract Safe Inputs specific logic for testing
async function loginToSafeInputs(page, isSafeInputs) {
  if (isSafeInputs) {
    // Perform login in order to move to the next page
    await page.type('#email', 'owner-axe@phac-aspc.gc.ca'); // email field
    await page
      .locator('button[type="submit"]', { hasText: /sign in/i }) // case insensitive regex search for sign in button
      .click();

    // Bypass authentication in the dev environment
    const textSelector = await page
      .locator('text/Or click here to complete authentication')
      .waitHandle();

    textSelector.click();

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
  }
}

// (async () => {
export async function runAccessibilityScan(isSafeInputs=true) {
  const visitedPages = new Set(); // To track visited pages and avoid duplication
  const allResults = []; // Collect all processed results

  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || null; // Use docker puppeteer path if running in container, otherwise, use system default

  // Launch the browser
  const browser = await puppeteer.launch({
    executablePath: executablePath || undefined, // To work in both docker with local chrome path
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setBypassCSP(true);

  // Navigate to your login page
  await page.goto(HOMEPAGE_URL, { waitUntil: 'networkidle2' }); // Wait until the page is fully loaded

  // Perform accessibility scan on the login page (localhost) before logging in
  console.log('\nAssessing login page:', HOMEPAGE_URL);
  const homePageResults = await new AxePuppeteer(page).analyze();

  allResults.push({
    url: HOMEPAGE_URL,
    results: homePageResults,
  });

  await loginToSafeInputs(page, isSafeInputs);

  // Start crawling from the dashboard or starting point
  await crawlPage(
    page,
    browser,
    HOMEPAGE_URL,
    visitedPages,
    allResults,
    blacklistPatterns,
  );

  const {
    urlsWithViolations,
    urlsWithSeriousImpactViolations,
    urlsWithIncompletes,
  } = await processAxeReport(allResults);

  console.log('\nResults Summary:');
  console.log('URLs with violations:', urlsWithViolations);
  console.log(
    'URLs with violations with serious impact:',
    urlsWithSeriousImpactViolations,
  );
  console.log('URLs with incompletes:', urlsWithIncompletes);

  // Close the browser
  await browser.close();
}

// if main run as SafeInputs (with login section)
if (import.meta.url.startsWith('file:')) { 
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) { 
    await runAccessibilityScan()
  }
}
