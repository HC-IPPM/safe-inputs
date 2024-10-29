import { franc } from 'franc';

export async function detectAriaBilingualIssues(page) {
  // https://github.com/wooorm/franc/tree/main
  // Extract ARIA labels and process language detection
  const ariaLabels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[aria-label]')).map(
      (element) => ({
        html: element.outerHTML,
        label: element.getAttribute('aria-label'),
      }),
    );
  });

  const ariaBilingualIssues = ariaLabels
    .map(({ html, label }) => {
      const detectedLanguage = franc(label, { minLength: 3 });

      const containsFrench = detectedLanguage === 'fra';
      const containsEnglish = detectedLanguage === 'eng';

      if (!containsFrench || !containsEnglish) {
        return {
          html,
          label,
          message:
            'ARIA label does not contain both French and English content',
        };
      }
      return null;
    })
    .filter((issue) => issue !== null);
  return ariaBilingualIssues;
}
