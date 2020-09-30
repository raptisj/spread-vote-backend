// // const getTwitterImage = require('../controllers/guestController');

// const scraperObject = {
// 	url: 'https://twitter.com/jdnoc/photo',
// 	async scraper(browser) {
// 		let page = await browser.newPage();
// 		console.log(`Navigating to ${this.url}...`);
// 		await page.goto(this.url);

// 		// Wait for the required DOM to be rendered
// 		await page.waitForSelector('html body img');
// 		// Get the link to all the required books
// 		// let urls = await page.$$eval('section ol > li', links => {
// 		//     // Make sure the book to be scraped is in stock
// 		//     links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
// 		//     // Extract the links from the data
// 		//     links = links.map(el => el.querySelector('h3 > a').href)
// 		//     return links;
// 		// });

// 		let urls = await page.$eval('html body img', (el) => el.src);

// 		await page.goto('https://twitter.com/jdnoc');
// 		await page.waitForSelector(
// 			'html body div#react-root div div div main div div div div div div div div div div div div div div span span'
// 		);
// 		let names = await page.$eval(
// 			'html body div#react-root div div div main div div div div div div div div div div div div div div span span',
// 			(el) => el.textContent
// 		);
// 		let twitterName = await page.$eval(
// 			'html body div#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-15d164r.r-1g94qm0 > div > div > div.css-1dbjc4n.r-18u37iz.r-1wbh5a2 > div > span',
// 			(el) => el.textContent
// 		);

// 		const data = {
// 			urls,
// 			names,
// 			twitterName
// 		};
// 		console.log(data);
// 		return urls;
// 	}
// };

// module.exports = scraperObject;
