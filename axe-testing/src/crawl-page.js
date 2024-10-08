import { AxePuppeteer } from '@axe-core/puppeteer';

// Function to crawl and collect URLs for accessibility checks
export async function crawlPage(
  page,
  browser,
  HOMEPAGE_URL,
  visitedPages,
  urls,
  allResults,
  blacklistUrls,
) {
  const currentUrl = page.url();
  let uniqueUrl = currentUrl;

  console.log('Blacklist URLs:', blacklistUrls);
  console.log('Current URL:', currentUrl);

  // Skip if the URL is blacklisted
  // if (blacklistUrls.includes(currentUrl)) {
  if (Array.isArray(blacklistUrls) && blacklistUrls.includes(currentUrl)) {
    console.log(`Skipping blacklisted URL: ${currentUrl}`);
    return;
  }

  if (visitedPages.has(currentUrl)) {
    console.log(`Skipping already visited page: ${currentUrl}`);
    return;
  }

  console.log(`Crawling page: ${currentUrl}`);
  visitedPages.add(currentUrl); // Mark this page as visited

  if (currentUrl === HOMEPAGE_URL) {
    uniqueUrl += '-post-login';
  }

  urls.push(uniqueUrl); // For reporting later

  // Run Axe accessibility checks on the current page
  const results = await new AxePuppeteer(page).analyze();

  // Add the results to allResults
  allResults.push({
    url: uniqueUrl,
    results,
  });

  // Get all links on the current page
  const links = await page.$$eval('a', (anchors) =>
    anchors.map((anchor) => anchor.href),
  );

  // Crawl through each link found on the current page
  for (const link of links) {
    // Avoid revisiting the same pages or external URLs
    if (!visitedPages.has(link) && link.startsWith(HOMEPAGE_URL)) {
      const newPage = await browser.newPage();
      await newPage.goto(link, { waitUntil: 'networkidle2' });
      await crawlPage(
        newPage,
        browser,
        HOMEPAGE_URL,
        visitedPages,
        urls,
        allResults,
        blacklistUrls,
      ); // Recursively crawl new pages
      await newPage.close(); // Close new page after crawling
    }
  }
}
