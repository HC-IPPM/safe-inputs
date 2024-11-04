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

  // console.log('Extracted ARIA Labels:', ariaLabels); // Check extracted labels


  const ariaBilingualIssues = ariaLabels
    .map(({ html, label }) => {
      // const detectedLanguage = franc(label, { minLength: 3 });
      const detectedLanguage = franc(label || '', { minLength: 3 });

      const containsFrench = detectedLanguage === 'fra';
      const containsEnglish = detectedLanguage === 'eng';

      // console.log(`Label: "${label}", Detected Language: ${detectedLanguage}`);


      if (!containsFrench || !containsEnglish) {
        return {
          label,
          detectedLanguage,
          html,
          message: 'ARIA label does not contain both French and English content',
        };
      }
      return null;
    })
    .filter((issue) => issue !== null);
  
  // console.log('Bilingual Issues Detected:', ariaBilingualIssues); 
  return ariaBilingualIssues;
}
