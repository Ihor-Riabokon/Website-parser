function findWordsAmount(searchStr, str) {
  const searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  let startIndex = 0;
  let index;
  let hits = [];
  str = str.toLowerCase();
  searchStr = searchStr.toLowerCase();
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    hits.push(index);
    startIndex = index + searchStrLen;
  }
  return hits.length;
}

export function getNextLink($) {
  const links = [];
  const relativeLinks = $(`a[href^='/']`);
  relativeLinks.each(function () {
    links.push($(this).attr('href'));
  });
  const randomLink = links[Math.floor(Math.random() * links.length)];
  return randomLink;
}

export function searchForWord($, word) {
  const bodyText = $('html > body').text();
  return findWordsAmount(word, bodyText);
}

export function prepareResults(arr) {
  let text = '';
  arr.forEach(item => {
    text += `${item.site} - ${item.wordsAmount}\n`;
  })
  return text;
}
