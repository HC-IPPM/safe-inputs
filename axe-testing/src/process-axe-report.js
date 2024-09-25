import fs from 'fs';

// Load ignored URLs and whitelisted violations and incompletes from the config
const configPath = './whitelist-config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('config.ignoreViolations', config.ignoreViolations);

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
      violationIds, //This is temp to compare with other methods
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
}
