import fs from 'fs';
import path from 'path';

// Load ignored URLs and whitelisted violations and incompletes from the config
const configPath = './axeignore.json';

// Load config file
async function loadConfig(configPath) {
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    config.blacklistPatterns = (config.blacklistPatterns || []).map(
      (pattern) => new RegExp(pattern),
    );

    return config;
  } catch (error) {
    console.error(`Failed to load config file at ${configPath}:`, error);
    throw error;
  }
}

function isUrlBlacklisted(url, blacklistPatterns) {
  return blacklistPatterns.some((regex) => regex.test(url));
}

function filterResults(results, ignoreList) {
  return results.filter((item) => !ignoreList.includes(item.id));
}

export async function processAxeReport(allResults, testConfig = null) {
  const urlsWithViolations = [];
  const urlsWithSeriousImpact = [];
  const urlsWithAriaBilingualIssues = [];
  const filteredResults = [];

  console.log('\nProcessing results.');

  // Load config file
  const config = testConfig || (await loadConfig(configPath)); // This allows for mocking config in tests

  for (const { url, results, ariaBilingualIssues } of allResults) {
    // Skip URLs based on regex blacklist patterns
    if (isUrlBlacklisted(url, config.blacklistPatterns)) {
      console.log(`Skipping exempted URL: ${url}`);
      continue;
    }
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
      incomplete: filteredIncomplete,
      ariaBilingualIssues,
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

    // Add URL if there are bilingual ARIA issues
    if (ariaBilingualIssues && ariaBilingualIssues.length > 0) {
      urlsWithAriaBilingualIssues.push({ url, ariaBilingualIssues });
    }
  }

  // REPORT - Generate a timestamp and save the results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Replaces colons and periods with dashes to make it file-safe

  // Prepare the result object
  const result = {
    exemptedViolationIds: config.ignoreViolations || [],
    exemptedIncompleteIds: config.ignoreIncomplete || [],
    exemptedUrlPattersn: config.blacklistPatterns || [],
    urlsWithViolations,
    urlsWithSeriousImpact,
    urlsWithAriaBilingualIssues,
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

  return {
    urlsWithViolations,
    urlsWithSeriousImpact,
    urlsWithAriaBilingualIssues,
  };
}
