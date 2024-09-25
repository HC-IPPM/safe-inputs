import { getPages } from './src/get-url-slugs.js';
import { processAxeReport } from './src/process-axe-report.js';
import puppeteer from 'puppeteer';
import { AxePuppeteer } from 'axe-puppeteer';
import 'dotenv-safe/config.js';

const { ROOT_URL } = process.env;

(async () => {
  const visitedPages = new Set(); // To track visited pages and avoid duplication
  const urls = []; //collect urls for Axe scan
  let allResults = []; // Collect all processed results

  // Launch the browser
  const browser = await puppeteer.launch({
    headless: false,
    // args: ['--ignore-certificate-errors', '--disable-web-security'],
  });

  const page = await browser.newPage();
  // Bypass content security policies (CSP)
  await page.setBypassCSP(true);

  // Navigate to your login page
  await page.goto(ROOT_URL, { waitUntil: 'networkidle2' }); // Wait until the page is fully loaded

  // Perform accessibility scan on the login page before logging in
  console.log('Running accessibility scan on the login page...');
  const loginPageResults = await new AxePuppeteer(page).analyze();
  console.log('http://127.0.0.1:8080 assessed');

  // Push url and axe results of login page
  urls.push(ROOT_URL); // Add login page URL to the list of URLs for accessibility checks

  allResults.push({
    url: ROOT_URL,
    results: loginPageResults,
  });

  // Login to move to the next page
  http: await page.type('#email', 'joe.smith@canada.ca'); // email field
  await page.click(
    '#react-root > div > div:nth-child(2) > div.chakra-container.css-o2miap > div > form > button', // login button selector
  );

  // // Custom wait function using setTimeout
  // const sleep = (milliseconds) =>
  //   new Promise((resolve) => setTimeout(resolve, milliseconds));

  // // Wait for 10 seconds using the custom sleep function
  // await sleep(40000);


  // Bypass authentication in dev environment by clicking the link
  await page.waitForXPath(
    "//a[contains(text(), 'Or click here to complete authentication')]",
    { timeout: 5000 },
  );
  const [link] = await page.$x(
    "//a[contains(text(), 'Or click here to complete authentication')]",
  );

  if (link) {
    await link.click();
    console.log('Link clicked');
  } else {
    console.log('Link not found');
    return; // Exit if the link is not found
  }

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
  // await page.waitForSelector(
  //   '#react-root > div > div:nth-child(2) > div.chakra-container.css-tjdidn > div > div > div > table',
  //   { visible: true, timeout: 10000 },
  // );

  // Start crawling from the dashboard or starting point
  await crawlPage(page, browser, visitedPages, urls, allResults);

  const { urlsWithViolations, urlsWithSeriousImpact, filteredResults } =
    await processAxeReport(allResults);

  console.log('Filtered Results for Each URL:');
  filteredResults.forEach((result) => {
    console.log('');
    console.log(`RESULTS FOR: ${result.url}`);
    console.log(`Violation IDs:, ${result.violationIds}`); //This is temp to compare with other methods
    console.log(`Violations:`, JSON.stringify(result.violations, null, 2));
    console.log(`Incomplete:`, JSON.stringify(result.incomplete, null, 2));
    console.log('');
  });

  console.log('Summary:');
  console.log('URLs with violations:', urlsWithViolations);
  console.log('URLs with serious impact:', urlsWithSeriousImpact);

  // Close the browser
  await browser.close();
})();




// // Function to crawl and run accessibility tests
// async function crawlPage(page, browser, visitedPages) {
//   const currentUrl = page.url();
  
//   if (visitedPages.has(currentUrl)) {
//     console.log(`Skipping already visited page: ${currentUrl}`);
//     return;
//   }

//   console.log(`Crawling page: ${currentUrl}`);
//   visitedPages.add(currentUrl); // Mark this page as visited

//   // Run Axe accessibility checks on the current page
//   const results = await new AxePuppeteer(page).analyze();
//   // console.log(`Accessibility report for ${currentUrl}:`, results);
//   console.log(`assessing ${currentUrl}`);

//   // Get all links on the current page
//   const links = await page.$$eval('a', (anchors) =>
//     anchors.map((anchor) => anchor.href),
//   );

//   // Crawl through each link found on the current page
//   for (let link of links) {
//     if (
//       !visitedPages.has(link) &&
//       link.startsWith(ROOT_URL) // Adjust the base URL
//     ) {
//       const newPage = await browser.newPage();
//       await newPage.goto(link);
//       await crawlPage(newPage, browser, visitedPages); // Recursively crawl new pages
//       await newPage.close(); // Close the new page after crawling
//     }
//   }
// }

// Function to crawl and collect URLs for accessibility checks
async function crawlPage(page, browser, visitedPages, urls, allResults) {
  const currentUrl = page.url();

  if (visitedPages.has(currentUrl)) {
    console.log(`Skipping already visited page: ${currentUrl}`);
    return;
  }

  console.log(`Crawling page: ${currentUrl}`);
  visitedPages.add(currentUrl); // Mark this page as visited
  urls.push(currentUrl); // Add URL for accessibility checks later

  // Run Axe accessibility checks on the current page immediately
  const results = await new AxePuppeteer(page).analyze();
  // console.log(`Accessibility report for ${currentUrl}:`, results);

  // Add the results to allResults
  allResults.push({
    url: currentUrl,
    results: results,
  });

  // Get all links on the current page
  const links = await page.$$eval('a', (anchors) =>
    anchors.map((anchor) => anchor.href),
  );

  // Crawl through each link found on the current page
  for (let link of links) {
    // Avoid revisiting the same pages or external URLs
    if (!visitedPages.has(link) && link.startsWith(ROOT_URL)) {
      const newPage = await browser.newPage();
      await newPage.goto(link, { waitUntil: 'networkidle2' });
      await crawlPage(newPage, browser, visitedPages, urls, allResults); // Recursively crawl new pages
      await newPage.close(); // Close the new page after crawling
    }
  }
}

