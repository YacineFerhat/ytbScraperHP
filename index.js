const puppeteerExtra = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const { db } = require("./db.config");
const { table } = require("./config");

scrapeScriptTag = async () => {
  puppeteerExtra.use(stealthPlugin());
  const browser = await puppeteerExtra.launch({
    headless: true,
    args: [`--window-size=1920,1080`],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const page = await browser.newPage();
  let url = "https://www.youtube.com/";
  const scrape = async () => {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(2000);

    const containerChild = await page.evaluate(() => {
      return Array.from(
        document.querySelector(
          "#primary > .style-scope.ytd-two-column-browse-results-renderer > #contents "
        ).children
      ).length;
    });
    let data = [];
    try {
      for (let i = 1; i < containerChild; i++) {
        for (let j = 1; j < 5; j++) {
          if (i !== 3) {
            let titleSelector = await page.$(
              `#primary > .style-scope.ytd-two-column-browse-results-renderer > #contents  > ytd-rich-grid-row:nth-child(${i}) > #contents > ytd-rich-item-renderer:nth-child(${j}) > #content > ytd-rich-grid-media > #dismissible > #details > #meta > h3 `
            );
            let linkSelector = await page.$(
              ` #primary > .style-scope.ytd-two-column-browse-results-renderer > #contents  > ytd-rich-grid-row:nth-child(${i}) > #contents > ytd-rich-item-renderer:nth-child(${j}) > #content > ytd-rich-grid-media > #dismissible >  ytd-thumbnail > a  `
            );
            let personSelector = await page.$(
              `#primary > .style-scope.ytd-two-column-browse-results-renderer > #contents  > ytd-rich-grid-row:nth-child(${i}) > #contents > ytd-rich-item-renderer:nth-child(${j}) > #content > ytd-rich-grid-media > #dismissible > #details > #meta > ytd-video-meta-block > #metadata > #byline-container > #channel-name > #container > #text-container > #text > a `
            );
            let viewsSelector = await page.$(
              `#primary > .style-scope.ytd-two-column-browse-results-renderer > #contents  > ytd-rich-grid-row:nth-child(${i}) > #contents > ytd-rich-item-renderer:nth-child(${j}) > #content > ytd-rich-grid-media > #dismissible > #details > #meta > ytd-video-meta-block > #metadata > #metadata-line > span:nth-child(1)  `
            );
            let dateSelector = await page.$(
              `#primary > .style-scope.ytd-two-column-browse-results-renderer > #contents  > ytd-rich-grid-row:nth-child(${i}) > #contents > ytd-rich-item-renderer:nth-child(${j}) > #content > ytd-rich-grid-media > #dismissible > #details > #meta > ytd-video-meta-block > #metadata > #metadata-line > span:nth-child(2)  `
            );
            let title = await page.evaluate(
              (el) => el.textContent,
              titleSelector
            );
            let link = await page.evaluate((el) => el.href, linkSelector);
            let author = await page.evaluate(
              (el) => el.textContent,
              personSelector
            );
            let views = await page.evaluate(
              (el) => el.textContent,
              viewsSelector
            );
            let date = await page.evaluate(
              (el) => el.textContent,
              dateSelector
            );

            db.query(
              `INSERT INTO ${table} (title, link, author, views, date) 
          VALUES ( '${title}', '${link}', '${author}', '${views}', '${date}')`,
              (err, results, fields) => {
                if (err) {
                  console.log({ err });
                  console.log({ url: url });
                  console.log({ fields });
                }
                console.log({ results });
              }
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  await scrape();
};

scrapeScriptTag();
