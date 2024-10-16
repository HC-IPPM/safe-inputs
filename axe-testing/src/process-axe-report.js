import fs from 'fs';
import path from 'path';

// Load ignored URLs and whitelisted violations and incompletes from the config
const configPath = './whitelist-config.json';

// Load config file
async function loadConfig(configPath) {
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error(`Failed to load config file at ${configPath}:`, error);
    throw error;
  }
}

function filterResults(results, ignoreList, type) {
  return results.filter((item) => !ignoreList.includes(item.id));
}

export async function processAxeReport(allResults) {
  const urlsWithViolations = [];
  const urlsWithSeriousImpact = [];
  const filteredResults = [];

  console.log('\nProcessing results.');

  //load config file
  const config = await loadConfig(configPath);

  for (const { url, results } of allResults) {
    // Filter out exempted violations and incomplete issues from the result
    const filteredViolations = filterResults(
      results.violations,
      config.ignoreViolations,
      'violations',
    );
    const filteredIncomplete = filterResults(
      results.incomplete,
      config.ignoreIncomplete,
      'incomplete',
    );

    // Store the filtered results for the current URL
    filteredResults.push({
      url,
      violations: filteredViolations,
      // violationIds,
      incomplete: filteredIncomplete,
    });

    // Check if there are any violations left after filtering
    if (filteredViolations.length > 0) {
      urlsWithViolations.push(url);
    }

    // Extract serious violations and their IDs
    const seriousViolationIds = filteredViolations
      .filter((violation) => violation.impact === 'serious')
      .map((violation) => violation.id);

    if (seriousViolationIds.length > 0) {
      // Include the serious impact violation IDs with each URL
      urlsWithSeriousImpact.push(url, seriousViolationIds);
    }
  }

  // REPORT - Generate a timestamp and save the results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Replaces colons and periods with dashes to make it file-safe

  // Prepare the result object
  const result = {
    exemptedViolationIds: config.ignoreViolations || [],
    exemptedIncompleteIds: config.ignoreIncomplete || [],
    exemptedUrls: config.blacklistUrls || [],
    urlsWithViolations,
    urlsWithSeriousImpact,
    fullResults: filteredResults,
  };

  const resultsDir = path.resolve('./axe-results');
  const filename = `./axe-results/ci_axe_results_${timestamp}.json`;

  try {
    fs.mkdirSync(resultsDir, { recursive: true });
    fs.writeFileSync(filename, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Results saved to ${filename}`);
  } catch (error) {
    console.error(`Failed to save results to ${filename}:`, error);
    throw error;
  }

  return { urlsWithViolations, urlsWithSeriousImpact };
}
