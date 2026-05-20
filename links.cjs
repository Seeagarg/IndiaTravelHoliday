const axios = require('axios');
const cheerio = require('cheerio');

const urls = [
    'https://indiatravelholiday.com/rajasthan-tour-packages.php',
    'https://indiatravelholiday.com/kashmir-tour-packages.php',
    'https://indiatravelholiday.com/spiti-valley-tour-packages.php',
    'https://indiatravelholiday.com/uttarakhand-tour-packages.php'
];

const fs = require('fs');

async function getLinks() {
    let output = '';
    for (const url of urls) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            output += `\nLinks for ${url}:\n`;
            const links = new Set();
            $('a').each((i, el) => {
                const href = $(el).attr('href');
                if (href && href.endsWith('.php') &&
                    !href.includes('index') &&
                    !href.includes('contact') &&
                    !href.includes('about') &&
                    !href.includes('packages.php') &&
                    !href.includes('book-now') &&
                    !href.includes('privacy-policy') &&
                    !href.includes('terms-&-conditions')) {
                    links.add(href);
                }
            });
            links.forEach(link => {
                if (link.startsWith('http')) {
                    output += link + '\n';
                } else {
                    output += `https://indiatravelholiday.com/${link}\n`;
                }
            });
        } catch (e) {
            output += `Error fetching ${url}: ${e.message}\n`;
        }
    }
    fs.writeFileSync('results.txt', output);
    console.log('Results written to results.txt');
}

getLinks();
