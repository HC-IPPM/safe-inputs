// import { evaluateAccessibility } from './accessibility-checks.js';
// import fs from 'fs';
// import { URL } from 'url';

// // load ignored urls and whitelisted violations and incompletes
// const configPath = './whitelist-config.json';
// const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// // Helper function to normalize URLs (remove query params if needed - was having issues with some not being removed)
// function normalizeUrl(urlStr) {
//   try {
//     const urlObj = new URL(urlStr);
//     // Normalize the pathname (remove double slashes) and decode the URL
//     urlObj.pathname = urlObj.pathname.replace(/\/{2,}/g, '/');
//     return urlObj.toString();
//   } catch (e) {
//     console.error(`Failed to parse URL: ${urlStr}`);
//     return urlStr;
//   }
// }


// // Process accessibility reports for multiple urls
// export async function processAxeReport(pageInstance, urls) {
//   let allResults = [];
//   let urlsWithViolations = [];
//   let urlsWithSeriousImpact = [];

//   // Normalize whitelist URLs
//   const normalizedWhitelist = config.whitelistUrls.map(normalizeUrl);

//   for (const rawUrl of urls) {
//     const url = normalizeUrl(rawUrl); // for comparison

//     // Skip URLs that are in the whitelist (normalized)
//     // if (config.whitelistUrls.includes(url)) {
//     if (normalizedWhitelist.includes(url)) {
//       console.log(`Skipping whitelisted URL: ${url}`);
//       // continue;
//     } else {
//       console.log('Evaluating URL:', url);

//       const result = await evaluateAccessibility(url, pageInstance);
//       console.log(result);

//       // Filter out ignored violations and incomplete issues from the result
//       result.violations = result.violations.filter(
//         (violation) => !config.ignoreViolations.includes(violation.id),
//       );

//       result.incomplete = result.incomplete.filter(
//         (incomplete) => !config.ignoreIncomplete.includes(incomplete.id),
//       );

//       // Check if there are any violations left after filtering
//       if (result.violations.length > 0) {
//         urlsWithViolations.push(url);
//       }

//       // Check if there are violations with serious impact
//       const hasSeriousImpact = result.violations.some(
//         (violation) => violation.impact === 'serious',
//       );
//       if (hasSeriousImpact) {
//         urlsWithSeriousImpact.push(url);
//       }

//       // Only add results for URLs that were evaluated (i.e., not skipped)
//       if (result.violations.length > 0 || result.incomplete.length > 0) {
//         console.log(`Adding to results: ${url}`);

//         allResults.push(result); // Add only URLs that were evaluated
//       }
//     }
//   }

//   return { allResults, urlsWithViolations, urlsWithSeriousImpact };
// }
// //     if (result.violations.length > 0) {
// //       urlsWithViolations.push(url);
// //     }

// //     const hasSeriousImpact = result.violations.some(
// //       (violation) => violation.impact === 'serious',
// //     );
// //     if (hasSeriousImpact) {
// //       urlsWithSeriousImpact.push(url);
// //     }

// //     allResults.push(result);
// //   }

// //   return { allResults, urlsWithViolations, urlsWithSeriousImpact };
// // }

// -----------------------------------------------------------

// export async function processAxeReport(allResults) {
//   let urlsWithViolations = [];
//   let urlsWithSeriousImpact = [];

//   for (const { url, results } of allResults) {
//     // Expect `allResults` to be an array of objects
//     console.log(`Processing results for ${url}`);

//     // Filter out ignored violations and incomplete issues from the result
//     results.violations = results.violations.filter(
//       (violation) => !config.ignoreViolations.includes(violation.id),
//     );

//     results.incomplete = results.incomplete.filter(
//       (incomplete) => !config.ignoreIncomplete.includes(incomplete.id),
//     );

//     // Check if there are any violations left after filtering
//     if (results.violations.length > 0) {
//       urlsWithViolations.push(url);
//     }

//     // Check if there are violations with serious impact
//     const hasSeriousImpact = results.violations.some(
//       (violation) => violation.impact === 'serious',
//     );
//     if (hasSeriousImpact) {
//       urlsWithSeriousImpact.push(url);
//     }
//   }

//   return { urlsWithViolations, urlsWithSeriousImpact };
// }

import fs from 'fs';

// Load ignored URLs and whitelisted violations and incompletes from the config
const configPath = './whitelist-config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export async function processAxeReport(allResults) {
  let urlsWithViolations = [];
  let urlsWithSeriousImpact = [];
  let filteredResults = [];

  for (const { url, results } of allResults) {
    console.log(`Processing results for ${url}`);

    // Filter out ignored violations and incomplete issues from the result
    const filteredViolations = results.violations.filter(
      (violation) => !config.ignoreViolations.includes(violation.id),
    );

    const filteredIncomplete = results.incomplete.filter(
      (incomplete) => !config.ignoreIncomplete.includes(incomplete.id),
    );

    // Extract violation IDs for each URL
    const violationIds = filteredViolations.map((violation) => violation.id); //This is temp to compare with other methods

    // Store the filtered results for the current URL
    filteredResults.push({
      url,
      violations: filteredViolations,
      violationIds: violationIds, //This is temp to compare with other methods
      incomplete: filteredIncomplete,
    });

    // Check if there are any violations left after filtering
    if (filteredViolations.length > 0) {
      urlsWithViolations.push(url);
    }

    // Check if there are violations with serious impact
    const hasSeriousImpact = filteredViolations.some(
      (violation) => violation.impact === 'serious',
    );
    if (hasSeriousImpact) {
      urlsWithSeriousImpact.push(url);
    }
  }

  return { urlsWithViolations, urlsWithSeriousImpact, filteredResults };
};

//   if (!Array.isArray(allResults)) {
//     console.error('allResults is not an array');
//     return { urlsWithViolations, urlsWithSeriousImpact };
//   }

//   for (const { url, results } of allResults) {
//     console.log(`Processing results for ${url}`);

//     // Filter out ignored violations and incomplete issues from the result
//     results.violations = results.violations.filter(
//       (violation) => !config.ignoreViolations.includes(violation.id),
//     );

//     results.incomplete = results.incomplete.filter(
//       (incomplete) => !config.ignoreIncomplete.includes(incomplete.id),
//     );

//     // Check if there are any violations left after filtering
//     if (results.violations.length > 0) {
//       urlsWithViolations.push(url);
//     }

//     // Check if there are violations with serious impact
//     const hasSeriousImpact = results.violations.some(
//       (violation) => violation.impact === 'serious',
//     );
//     if (hasSeriousImpact) {
//       urlsWithSeriousImpact.push(url);
//     }
//   }

//   return { urlsWithViolations, urlsWithSeriousImpact };
// };
