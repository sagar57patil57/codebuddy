const cheerio = require('cheerio');
const request = require('request-promise');
const ContestPayload = require('../utils/contestPayloads');
const Util = require('../utils/utilities');
const cache = require('../services/cache');
const { Constants } = require('../utils/constants');
const Calender = require('../services/calender');
const puppeteer = require('puppeteer');

scrapeCodeForces = async () => {
    try {
        const scrapedData = await request(ContestPayload.codeforcesContests);
        let $ = cheerio.load(scrapedData);
        const data = $(ContestPayload.selectorClasses.cf);
        let contests = [];
        data.each((i, el) => {
            if (i !== 0) {
                const tds = $(el).find('td');
                const name = $(tds[0]).text().replace(/\s\s+/g, '').replace('\n', '');
                const dateTime = $(tds[2]).text().replace(/\s\s+/g, '');
                const length = $(tds[3]).text().replace(/\s\s+/g, '');
                const contestLink = $(tds[5]).find('.contestParticipantCountLinkMargin').attr('href');
                const record = Util.getCfContestObject(name, dateTime, length, contestLink, Constants.CODEFORCES);
                contests.push(record);
            }
        })
        console.log("done cf");
        await cache.put(Constants.CF_CONTESTS, contests, 3600 * 5);
    } catch (err) {
        console.log(err);
    }
}

scrapeHackerrank = async () => {
    
    const scrapedData = await request(ContestPayload.hackerrankContests);
    let $ = cheerio.load(scrapedData);
    const data = $(ContestPayload.selectorClasses.hackerrank);
    let contests = [], title = null, contestLink = null, record = null, timing = null;
    data.each((i, el) => {
        title = $(el).children('.contest-item-title').text().trim()//  title
        contestLink = $(el).find('.text-link').attr('href').trim()   //link
        timing = $(el).find('.contest-status').text()
        record = Util.getContestObject(title, timing, contestLink, Constants.HACKER_RANK);
        if (record) {
            contests.push(record);
        }
    });
    console.log("done hackerrank", contests);
    await cache.put(Constants.HACKER_RANK_CONTESTS, contests, 3600 * 5);

}

scrapeCodeChef = async () => {

    try {
        const scrapedData = await request(ContestPayload.codechefContests);
        let $ = cheerio.load(scrapedData);
        const data = $(ContestPayload.selectorClasses.codechef);
        // let contests = [], title = null, contestLink = null, record = null, timing = null;
        data.each((i, el) => {
            const tds = $(el).find('td');
            title = $(tds[0]).text().replace(/\s\s+/g, '');
            console.log(title)
            //const dateTime = $(tds[2]).text().replace(/\s\s+/g, '');
        });
    } catch (err) {
        console.log(err)
    }

}

scrapeHackerearthCode = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');
  await page.goto('https://www.hackerearth.com/challenges/', {waitUntil: 'load', timeout: 0});
  page.waitForSelector('#challenge-container > div.upcoming.challenge-list > div.challenge-card-modern > div.challenge-button');
  const records = await page.$$('#challenge-container > div.upcoming.challenge-list > div.challenge-card-modern');
  let hackerearthResult = [];
  for (let record of records) {
    //const record = records[i];
    const type = await record.$eval('.challenge-card-wrapper .challenge-content .challenge-type', (type) => type.innerHTML.replace(/\s\s+/g, ''));
    const title = await record.$eval('.challenge-card-wrapper .challenge-content .challenge-list-title', (title) => title.innerHTML.replace(/\s\s+/g, ''));
    const date = await record.$eval('.challenge-card-wrapper .challenge-content .challenge-desc .date', (date) => date.innerHTML.replace(/\s\s+/g, ''));
    const data = Util.getHackerRankContestObject(type.toLowerCase(), title, date, Constants.HACER_EARTH);
    hackerearthResult.push(data);
  }
  console.log(hackerearthResult);
  await browser.close();
  console.log("done cf");
    await cache.put(Constants.HR_CONTESTS, hackerearthResult, 3600 * 5);
}

exports.getContest = () => {

    scrapeHackerrank();
    scrapeCodeForces();
    //scrapeCodeChef();
    scrapeHackerearthCode();

}

exports.getContestList = async (req, res) => {

    const hackerrankResult = (await cache.get(Constants.HACKER_RANK_CONTESTS) || []);
    const cfResult = (await cache.get(Constants.CF_CONTESTS) || []);
    const hRResult = (await cache.get(Constants.HR_CONTESTS) || []);
    const result = [...hackerrankResult, ...cfResult, ...hRResult];
    return res.status(200).json({
        success: true,
        data: result,
        message: 'success'
    });

}

exports.addToCalender = async (req, res) => {

    const desc = `Contest ${req.body.title} - ${req.body.site} will start at ${req.body.schedule}. click here to check: ${req.body.link}`;
    const payload = {
        startDate: req.body.schedule,
        contestLength: parseInt(req.body.length.split(":")[0]),
        description: desc
    };
    const response = await Calender.init(payload, req.body.site);
    return res.status(200).json({
        success: response ? true : false,
        data: null,
        message: response ? 'successfully added ' + response + ' event' : 'Something bad happened'
    });

}