import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

const PORT = process.env.TEST_PORT || 8080;

describe('End-to-End Accessibility Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: puppeteer.executablePath(),
    });
    page = await browser.newPage();
    await page.setBypassCSP(true);
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('should have no violations on the accessible page', async () => {
    await page.goto('http://localhost:${PORT}/accessible.html', {
      waitUntil: 'networkidle2',
    });
    const results = await new AxePuppeteer(page).analyze();

    expect(results.violations).toHaveLength(0);
    console.log('Accessible page violations:', results.violations);
  });

  test('should detect violations on the inaccessible page', async () => {
    // Follow the link to the inaccessible page
    await page.goto('http://localhost:8080/inaccessible.html', {
      waitUntil: 'networkidle2',
    });
    const results = await new AxePuppeteer(page).analyze();

    expect(results.violations.length).toBeGreaterThan(0);
    console.log('Inaccessible page violations:', results.violations);
  });
});
