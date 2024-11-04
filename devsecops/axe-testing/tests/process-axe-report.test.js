import { processAxeReport } from '../src/process-axe-report.js';

describe('processAxeReport function', () => {
  it('should filter out exempted violations and incompletes', async () => {
    const mockResults = [
      {
        url: 'http://localhost:8080/test',
        results: {
          violations: [{ id: 'test-violation-test-id', impact: 'serious' }],
          incomplete: [{ id: 'test-incomplete-test-id' }],
        },
      },
    ];

    const config = {
      ignoreViolations: ['test-violation-test-id'],
      ignoreIncomplete: ['test-incomplete-test-id'],
      blacklistPatterns: [],
    };

    const { urlsWithViolations, urlsWithSeriousImpact } =
      await processAxeReport(mockResults, config);

    console.log(urlsWithViolations, urlsWithSeriousImpact);

    expect(urlsWithViolations).toHaveLength(0);
    expect(urlsWithSeriousImpact).toHaveLength(0);
  });
  // TODO - add in having violations senario
});
