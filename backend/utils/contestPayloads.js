//  HACKERRANK

exports.hackerrankContests = {
    uri: 'https://www.hackerrank.com/contests',
    headers: {
        "Accept": "application/vnd.api+json",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.5",
        "Host": "www.hackerrank.com",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "Referer": "https://www.hackerrank.com/contests",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
    },
    gzip: true
};

//  CODEFORCES

exports.codeforcesContests = {
    uri: 'https://codeforces.com/contests',
    headers: {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.5",
        "Host": "codeforces.com",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": "https://codeforces.com/contests",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
    },
    gzip: true
};

//  CODECHEF

exports.codechefContests = {
    uri: 'https://www.codechef.com/contests',
    headers: {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.5",
        "Host": "www.codechef.com",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "Referer": "https://www.codechef.com/contests/?itm_medium=navmenu&itm_campaign=allcontests_head",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        "Cookie": "SESS93b6022d778ee317bf48f7dbffe03173=7e2580b098ccc7dc5eea403b786c25a6; _gaexp=GAX1.2.Od5SiFL4TVeOlCXN6R-Kkw.18875.1; _gcl_au=1.1.581534600.1622985026",
        "X-Requested-With": "XMLHttpRequest",
        "x-csrf-token": "97ec39715ddb07af6248f2bc8419c575694dc7860d31144d015cb7aa0c5dee5a",
        "TE": "Trailers"
    },
    gzip: true
};

exports.hackerearthContests = {
    uri: 'https://www.hackerearth.com/challenges/',
    headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.5",
        "Host": "hackerearth.zendesk.com",
        "Connection": "keep-alive",
        "Referer": "https://www.hackerearth.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        "Origin": "https://www.hackerearth.com"
    },
    gzip: true
};

exports.selectorClasses = {
    hackerrank: '#content > div > div > div > div > div.community-content > div > div > div.theme-m.contest-list.left-pane > div > div.active_contests.active-contest-container > ul > li > div.contest-tab-expander.has-buttons > div > div',
    cf: '#pageContent > div.contestList > div.datatable > div:nth-child(6) > table > tbody > tr',
    codechef: '#future-contests-data > tr',
    hackerearth: '#challenge-container > div.upcoming.challenge-list'
}