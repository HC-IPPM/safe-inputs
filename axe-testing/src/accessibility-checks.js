// https://github.com/dequelabs/axe-core-npm/blob/develop/packages/puppeteer/README.md
// https://github.com/puppeteer/puppeteer/issues/10882

// https://github.com/puppeteer/puppeteer/issues/290
// https://stackoverflow.com/questions/66214552/tmp-chromium-error-while-loading-shared-libraries-libnss3-so-cannot-open-sha

// https://github.com/dequelabs/axe-core-npm/blob/develop/packages/puppeteer/README.md 


import AxePuppeteer  from "@axe-core/puppeteer";
// import puppeteer from 'puppeteer'
import fs from 'fs';


// Evaluate accessibility for a single url
export async function evaluateAccessibility(url, page) {
  await page.goto(url, { cache: 'no-store' });
  try {
    const results = await new AxePuppeteer(page).analyze();

    const filename = "results.json"
    // fs.writeFileSync(filename, JSON.stringify(results, null, 2), 'utf-8');    
    fs.appendFileSync(filename, JSON.stringify(results, null, 2), 'utf-8');  

    // Simplified result (only incomplete and violations)
    const simplifiedResult = {
      url: results.url,
      incomplete: (results.incomplete || []).map(item => ({
        id: item.id,
        description: item.description,
        impact: item.impact,
        helpUrl: item.helpUrl,
        nodes: item.nodes.map(node => ({
          message: node.any.length > 0 ? node.any.map(msg => msg.message) : null,
          html: node.html,
        }))
      })),
      violations: (results.violations || []).map(item => ({
        id: item.id,
        description: item.description,
        impact: item.impact,
        helpUrl: item.helpUrl,
        nodes: item.nodes.map(node => ({
          message: node.any.length > 0 ? node.any.map(msg => msg.message) : null,
          html: node.html,
        }))
      }))
    };

    return simplifiedResult;
  } catch (e) {
    console.log(e);
  }
}

// // Process accessibility reports for multiple URLs and check conditions
// export async function processAxeReportForAllUrls(pageInstance, urls) {
//   let allResults = [];
//   let urlsWithViolations = [];  // Track URLs with violations
//   let urlsWithSeriousImpact = [];  // Track URLs with serious impact

//   for (const url of urls) {
//     console.log('Evaluating URL:', url);
//     const result = await evaluateAccessibility(url, pageInstance);

//     // Check if there are non-empty violations
//     const hasViolations = result.violations.length > 0;
//     if (hasViolations) {
//       urlsWithViolations.push(url);
//     }

//     // Check if there are violations with serious impact
//     const hasSeriousImpact = result.violations.some(
//       violation => violation.impact === 'serious'
//     );
//     if (hasSeriousImpact) {
//       urlsWithSeriousImpact.push(url);
//     }

//     allResults.push(result);  // Accumulate all results
//   }

//   // Display or log URLs with non-empty violations and serious impact
//   console.log('URLs with violations:', urlsWithViolations);
//   console.log('URLs with serious impact:', urlsWithSeriousImpact);

//   return { allResults, urlsWithViolations, urlsWithSeriousImpact };  // Return data if needed
// }