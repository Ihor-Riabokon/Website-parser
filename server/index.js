import request from 'request';
import cheerio from 'cheerio';
import fs from 'fs';

const URL = require('url-parse');

import { searchForWord, getNextLink, prepareResults } from './helpers';

const passedArgs = process.argv.slice(2);

if(passedArgs.length < 3) {
  process.exit(2);
}

class WebParser {
  constructor([site, depth, ...word]) {
    this.site = site.toLowerCase();
    this.depth = +depth;
    this.word = word.join(' ').toLowerCase();
    this.parseResults = [];
    this.baseUrl = new URL(site).protocol + '//' + new URL(site).hostname;
  }
  async run(){
    for (let i = 0; i < this.depth; i++) {
      try {
        const resp = await this.parseWebpage();
        this.parseResults.push(resp);
      } catch(e) {
        console.log('Error: ', e);
      }
    }
    return this.saveResults();
  }
  updateSite(newSite) {
    this.site = newSite.toLowerCase();
  }
  parseWebpage() {
    const { site, word, baseUrl } = this;
    return new Promise((resolve, reject) => {
      request(site, (error, response, html) => {
        if (!error) {
          const $ = cheerio.load(html);
          const wordsAmount = searchForWord($, word);
          const nextLink = getNextLink($);
          nextLink ? this.updateSite(`${baseUrl}${nextLink}`) : this.updateSite(`${baseUrl}`);
          resolve({
            site,
            wordsAmount,
          });
        } else {
          console.log(error);
          reject(error);
        }
      });
    })
  }
  saveResults() {
    const { parseResults } = this;
    const results = parseResults.length ? prepareResults(parseResults) : 'No words found.';
    fs.writeFile('result.txt', results, (err) => {
      if (err) {
        return console.log(er);
      }
      console.log('The file was saved!');
      process.exit(0);
    });
  }
}

new WebParser(passedArgs).run();

