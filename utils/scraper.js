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
  let twitterImage, name, twitterName, bio;

  try {
    await page.goto(`https://twitter.com/${pageURL}/photo`);
    await page.waitForSelector('html body img');
    twitterImage = await page.$eval('html body img', (el) => el.src);

    await page.goto(`https://twitter.com/${pageURL}`);
    await page.waitForSelector(
      'html body div#react-root div div div main div div div div div div div div div div div div div div span span'
    );
    name = await page.$eval(
      'html body div#react-root div div div main div div div div div div div div div div div div div div span span',
      (el) => el.textContent
    );
    twitterName = await page.$eval(
      'html body div#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-15d164r.r-1g94qm0 > div > div > div.css-1dbjc4n.r-18u37iz.r-1wbh5a2 > div > span',
      (el) => el.textContent
    );

    // bio = await page.$eval(
    //   '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-yfoy6g.r-18bvks7.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div:nth-child(3) > div > div.css-901oao.r-jwli3a.r-1qd0xha.r-a023e6.r-16dba41.r-ad9z0x.r-bcqeeo.r-qvutc0',
    //   (el) => el.textContent
    // );
    bio = await page.$eval(
      '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div:nth-child(3) > div > div > span',
      (el) => el.textContent
    );
  } catch (e) {
    console.log(e, 'error');
    const data = {};
    browser.close();
    return data;
  }
  const data = {
    twitterImage,
    name,
    twitterName,
    bio
  };

  browser.close();
  return data;
};

module.exports = webscraping;

// headless: true,
//     args: ["--no-sandbox"]
