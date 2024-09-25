import { getPages } from './src/get-url-slugs.js';
import { processAxeReport } from './src/process-axe-report.js';
// import puppeteer from 'puppeteer';
import 'dotenv-safe/config.js';

const {
  ROOT_URL,
  // ADMIN_LOGIN,
  // ADMIN_PASSWORD
} = process.env;

// process.on('SIGTERM', () => process.exit(0));
// process.on('SIGINT', () => process.exit(0));
// (async () => {
//   const browser = await puppeteer.launch({
//     executablePath: '/usr/bin/google-chrome',
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     headless: 'new',
//   });

//   const pageInstance = await browser.newPage();
//   await pageInstance.setBypassCSP(true);

//   // Get urls (withslugs)
//   const urls = await getPages(ROOT_URL, pageInstance, browser);

//   const { allResults, urlsWithViolations, urlsWithSeriousImpact } =
//     await processAxeReport(pageInstance, urls);

//   // console.log(
//   //   'Accessibility Results (incomplete and violations):',
//   //   JSON.stringify(allResults, null, 2),
//   // );
//   console.log(
//     'URLs with violations:',
//     JSON.stringify(urlsWithViolations, null, 2),
//   );
//   // console.log(
//   //   'URLs with serious impact:',
//   //   JSON.stringify(urlsWithSeriousImpact, null, 2),
//   // );

//   if (urlsWithViolations.length > 0) {
//     console.log(
//       'Failed accessability check. Exiting with code 1 due to violations.',
//     ); //actually only soft failing at this time.
//     await browser.close();
//     // process.exit(1);
//   }
//   await browser.close();
//   process.exit(0);
// })();
