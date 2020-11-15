const puppeteer = require('puppeteer');

const webscraping = async (pageURL) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });
  const page = await browser.newPage();
  await page.setDefaultTimeout(10000);

  console.log(`Navigating to ${`https://twitter.com/${pageURL}/photo`}...`);
  await page.goto(`https://twitter.com/${pageURL}/photo`);
  let twitter_image, name, twitter_name, bio;

  try {
    await page.goto(`https://twitter.com/${pageURL}/photo`);
    await page.waitForSelector('html body img');
    twitter_image = await page.$eval('html body img', (el) => el.src);

    await page.goto(`https://twitter.com/${pageURL}`);
    await page.waitForSelector(
      'html body div#react-root div div div main div div div div div div div div div div div div div div span span'
    );

    name = await page.$eval(
      'html body div#react-root div div div main div div div div div div div div div div div div div div span span',
      (el) => el.textContent
    );

    if (
      (await page.$(
        'html body div#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-15d164r.r-1g94qm0 > div > div > div.css-1dbjc4n.r-18u37iz.r-1wbh5a2 > div > span'
      )) !== null
    ) {
      twitter_name = await page.$eval(
        'html body div#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-15d164r.r-1g94qm0 > div > div > div.css-1dbjc4n.r-18u37iz.r-1wbh5a2 > div > span',
        (el) => el.textContent
      );
    }

    bio = await page.$$eval(
      '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div:nth-child(3) > div > div > *',
      (el) => el.map((p) => p.textContent)
    );

    // bio = await page.$eval(
    //   '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div:nth-child(3) > div > div > span',
    //   (el) => el.textContent
    // );
  } catch (e) {
    console.log(e, 'error');
    const data = {};
    browser.close();
    return data;
  }

  console.log(twitter_name);

  const data = {
    twitter_image,
    name,
    twitter_name: twitter_name !== undefined ? twitter_name : name,
    bio: bio.join(' ')
  };

  browser.close();
  return data;
};

module.exports = webscraping;
