async function getSlugs(url, page, browser) {
  // given a url, get all of the associated slugs
  try {
    await page.goto(url);

    const slugs = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links
        .map(link => link.getAttribute('href'))
        .filter(href => href && href.startsWith('/'))
        .map(href => {
          const pathSegments = href.split('/').filter(segment => segment !== '');
          return pathSegments.join('/');
        });
    });
    return slugs;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export async function getPages(url, page, browser) {
  // concatenates slugs for a url, to the url to form an array of page url(s) for a particular endpoint
  let pages = [url]
  const slugs = await getSlugs(url, page, browser)
  for (const slug of slugs) {
    if (slug !== "" && slug !== "/"){
      pages.push(`${url}/${slug}`)
    }
  }
  console.log('Pages', pages)
  return pages 
}
