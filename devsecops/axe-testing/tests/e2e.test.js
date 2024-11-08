import { runAccessibilityScan } from '../index.js';

// describe('End-to-End Accessibility Test', () => {
//   it('should crawl and complete the accessibility for more than one pages', async () => {
//     process.env.HOMEPAGE_URL = 'http://localhost:8080/accessible.html'; // Start this page first, then should crawl to other

//     // Run the accessibility scan and capture the result
//     const isSafeInputs = false; // Skips the Safe Inputs specific login steps
//     const {
//       urlsWithViolations,
//       filteredResults
//     } = await runAccessibilityScan(isSafeInputs);

//   // Check that the scan crawled more than one page
//   const hasAccessiblePage = filteredResults.some(
//     (entry) => entry.url === 'http://127.0.0.1:8080/accessible.html'
//   );

//   const hasInaccessiblePage = filteredResults.some(
//     (entry) => entry.url === 'http://127.0.0.1:8080/inaccessible.html'
//   );

//   expect(hasAccessiblePage).toBe(true);
//   expect(hasInaccessiblePage).toBe(true);

//   // Check the accessible page has no violations
//   const accessiblePageViolations = urlsWithViolations.find(
//     (entry) => entry[0] === 'http://127.0.0.1:8080/accessible.html'
//   );
//   expect(accessiblePageViolations).toBeUndefined();

//   // Check the inaccessible page has violations
//   const hasInaccessiblePageViolations = urlsWithViolations.some(
//     (entry) => entry[0].includes('http://127.0.0.1:8080/inaccessible.html')
//   );
//   expect(hasInaccessiblePageViolations).toBe(true);
//   });
// });

describe('End-to-End Accessibility Test', () => {
  let scanResults;

  beforeAll(async () => {
    process.env.HOMEPAGE_URL = 'http://localhost:8080/accessible.html'; // Start with the first page
    const isSafeInputs = false; // Skips the Safe Inputs specific login steps
    scanResults = await runAccessibilityScan(isSafeInputs);
  });

  it('should crawl and scan more than one page', () => {
    const { filteredResults } = scanResults;

    const hasAccessiblePage = filteredResults.some(
      (entry) => entry.url === 'http://127.0.0.1:8080/accessible.html',
    );

    const hasInaccessiblePage = filteredResults.some(
      (entry) => entry.url === 'http://127.0.0.1:8080/inaccessible.html',
    );

    expect(hasAccessiblePage).toBe(true);
    expect(hasInaccessiblePage).toBe(true);
  });

  it('should not return violations for the accessible page.', () => {
    const { urlsWithViolations } = scanResults;

    const accessiblePageViolations = urlsWithViolations.find(
      (entry) => entry[0] === 'http://127.0.0.1:8080/accessible.html',
    );
    expect(accessiblePageViolations).toBeUndefined();
  });

  it('should return accessibility violations for the inaccessible page.', () => {
    const { urlsWithViolations } = scanResults;

    const hasInaccessiblePageViolations = urlsWithViolations.some(
      (entry) => entry[0] === 'http://127.0.0.1:8080/inaccessible.html',
    );
    expect(hasInaccessiblePageViolations).toBe(true);
  });
});
