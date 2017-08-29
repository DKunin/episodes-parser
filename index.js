#!/usr/bin/env node

'use strict';

const puppeteer = require('puppeteer');
const { EPISODES_HOST, EPISODES_USER, EPISODES_PASS } = process.env;

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: true
    });
    const page = await browser.newPage();

    await page.goto(EPISODES_HOST);

    await page.click('.login-btn');
    await page.waitFor(100);

    await page.focus('#username');
    await page.type(EPISODES_USER);
    await page.focus('#password');
    await page.type(EPISODES_PASS);
    await page.click('input[type=submit]');

    await page.waitFor('.to-watch-list');

    // await page.goto(`${EPISODES_HOST}/en/upcoming`);

    // await page.waitFor('.upcoming-list');

    const list = await page.evaluate(() => {
        const list = Array.from(document.querySelectorAll('.to-watch-list > li:not(:empty)'))
            .map(singleEpisode => {
                let episode = singleEpisode.querySelector('.episode-details a');
                let title = singleEpisode.querySelector('.secondary-link');
                let left = singleEpisode.querySelector('.upcoming-time-left');

                return {
                    episode: episode ? episode.innerText : null,
                    title: title ? title.innerText : null,
                    left: left ? left.innerText.replace(/\s/g, ' ') : null
                };
            });

        return {
          list
        };
    });

    // eslint-disable-next-line
    console.log(list);
    
    browser.close();
})();
