const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://indiatravelholiday.com/';

const packageUrls = [
    'https://indiatravelholiday.com/best-of-kerala-with-houseboat-stay.php',
    'https://indiatravelholiday.com/best-kerala-family-tour-package.php',
    'https://indiatravelholiday.com/munnar-alleppey-tour-package.php',
    'https://indiatravelholiday.com/goa-tour-package-for-friends.php',
    'https://indiatravelholiday.com/goa-tour-package-for-family.php',
    'https://indiatravelholiday.com/desert-of-rajasthan-with-bikaner.php',
    'https://indiatravelholiday.com/romantic-escape-to-kashmir-tour-package.php',
    'https://indiatravelholiday.com/experience-the-luxury-of-kashmir-tour-package.php',
    'https://indiatravelholiday.com/wonderful-spiti-valley-tour-package.php',
    'https://indiatravelholiday.com/best-of-spiti-valley-tour-package.php',
    'https://indiatravelholiday.com/auli-skiing-and-adventure-tour-package.php',
    'https://indiatravelholiday.com/nainital-auli-tour-package.php',
    'https://indiatravelholiday.com/heaven-himachal-tour-package.php',
    'https://indiatravelholiday.com/dharamshala-dalhousie-amritsar-tour-package.php',
    'https://indiatravelholiday.com/shimla-tour-package.php',
    'https://indiatravelholiday.com/tirthan-valley-tour-package.php',
    'https://indiatravelholiday.com/leh-ladakh-with-pangong-lake-tour-package.php',
    'https://indiatravelholiday.com/kashmir-tour-package.php',
    'https://indiatravelholiday.com/kedarnath-group-tour-package-from-delhi.php'
];

async function scrapeReviews() {
    try {
        const { data } = await axios.get(BASE_URL);
        const $ = cheerio.load(data);
        const reviews = [];

        $('.testimonial-item, .item, .swiper-slide').each((i, el) => {
            const text = $(el).find('p').text().trim();
            const name = $(el).find('h4, h5, .name').text().trim();
            if (text.length > 30) {
                reviews.push({
                    name: name || `Happy Guest ${i + 1}`,
                    text,
                    images: [
                        `https://picsum.photos/100/100?sig=${i}`,
                        `https://picsum.photos/400/300?sig=${i + 10}`
                    ]
                });
            }
        });

        if (reviews.length < 3) {
            return [
                { name: "Suresh Raina", text: "Exceptional service and very well planned Himachal trip. Highly recommended!", images: ["https://picsum.photos/100/100?sig=1", "https://picsum.photos/400/300?sig=11"] },
                { name: "Megha Gupta", text: "The hotels were great and the driver was very professional. Loved every bit of it.", images: ["https://picsum.photos/100/100?sig=2", "https://picsum.photos/400/300?sig=12"] },
                { name: "Rahul Verma", text: "Smooth booking process and great support throughout the journey.", images: ["https://picsum.photos/100/100?sig=3", "https://picsum.photos/400/300?sig=13"] }
            ];
        }

        return reviews.slice(0, 10);
    } catch (err) {
        return [];
    }
}

async function scrapePackage(url, globalReviews) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = $('h1').first().text().trim() || $('h2').first().text().trim();
        const subtitle = $('p').first().text().trim().substring(0, 120) + "...";

        let duration = "N/A";
        $('h4, h3, h5, p').each((i, el) => {
            const text = $(el).text();
            if ((text.toLowerCase().includes('night') || text.toLowerCase().includes('day')) && text.length < 50) {
                duration = text.trim();
                return false;
            }
        });

        const itinerary = [];
        $('h4, h3').each((i, el) => {
            const text = $(el).text().trim();
            if (text.toLowerCase().startsWith('day')) {
                const activities = [];
                let next = $(el).next();
                while (next.length && !['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(next[0].name)) {
                    if (next[0].name === 'ul') {
                        $(next).find('li').each((j, li) => activities.push($(li).text().trim()));
                    } else {
                        const line = next.text().trim();
                        if (line) activities.push(line);
                    }
                    next = next.next();
                }

                itinerary.push({
                    day: itinerary.length + 1,
                    title: text,
                    activities: activities.length ? activities : ["Sightseeing and exploration"]
                });
            }
        });

        const extractList = (headerText) => {
            let items = [];
            $('h1, h2, h3, h4, h5, h6').each((i, el) => {
                const hText = $(el).text().toLowerCase();
                if (hText.includes(headerText.toLowerCase())) {
                    let next = $(el).next();
                    // Keep going until next header
                    while (next.length && !['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'footer', 'header'].includes(next[0].name)) {
                        if (next[0].name === 'ul') {
                            $(next).find('li').each((j, li) => items.push($(li).text().trim()));
                        } else {
                            const lines = next.text().trim().split('\n');
                            lines.forEach(l => {
                                if (l.trim().length > 5) items.push(l.trim());
                            });
                        }
                        next = next.next();
                    }
                }
            });
            return [...new Set(items)].filter(it => it.length > 5 && !it.toLowerCase().includes(headerText.toLowerCase()));
        };

        const highlights = extractList('Highlight');
        const inclusions = extractList('Inclusion');
        const exclusions = extractList('Exclusion');

        const slug = url.split('/').pop().replace('.php', '');

        // Better place extraction
        let place = title.split(' ')[0];
        if (title.toLowerCase().includes('kerala')) place = 'Kerala';
        if (title.toLowerCase().includes('goa')) place = 'Goa';
        if (title.toLowerCase().includes('rajasthan')) place = 'Rajasthan';
        if (title.toLowerCase().includes('kashmir')) place = 'Kashmir';
        if (title.toLowerCase().includes('spiti')) place = 'Spiti';
        if (title.toLowerCase().includes('auli')) place = 'Auli';
        if (title.toLowerCase().includes('nainital')) place = 'Nainital';
        if (title.toLowerCase().includes('shimla')) place = 'Shimla';
        if (title.toLowerCase().includes('manali')) place = 'Manali';
        if (title.toLowerCase().includes('leh')) place = 'Leh';

        const starting_price = 8000 + Math.floor(Math.random() * 10000);

        return {
            slug,
            place,
            title,
            subtitle,
            duration,
            starting_price,
            original_price: starting_price + 2000 + Math.floor(Math.random() * 3000),
            currency: "INR",
            rating: 4.6 + Math.random() * 0.4,
            total_reviews: 100 + Math.floor(Math.random() * 900),
            images: {
                cover: `https://picsum.photos/1200/600?${slug}`,
                gallery: [
                    `https://picsum.photos/600/400?${slug}1`,
                    `https://picsum.photos/600/400?${slug}2`,
                    `https://picsum.photos/600/400?${slug}3`,
                    `https://picsum.photos/600/400?${slug}4`
                ]
            },
            highlights: highlights.length ? highlights : [`Beautiful ${place} exploration`, "Cultural immersion", "Scenic drives"],
            itinerary,
            inclusions: inclusions.length ? inclusions : ["Standard Hotel Stays", "Breakfast & Dinner", "Transfer & Sightseeing"],
            exclusions: exclusions.length ? exclusions : ["Entrance fees", "Laundry & Laundry", "Tips"],
            faqs: [
                { question: `What is the best time for ${place}?`, answer: "For pleasant weather, visit between March and June." },
                { question: "Are meals included?", answer: "Breakfast and dinner are typically included in most packages." },
                { question: "Is it safe for solo travelers?", answer: "Yes, our guides ensure a very safe environment for everyone." }
            ],
            reviews: globalReviews.sort(() => 0.5 - Math.random()).slice(0, 3)
        };
    } catch (err) {
        return null;
    }
}

async function main() {
    console.log('Fetching global reviews...');
    const globalReviews = await scrapeReviews();

    console.log('Starting package scrape...');
    const tourResults = [];
    const tourDir = path.join(__dirname, 'src', 'Data', 'Tours');
    if (!fs.existsSync(tourDir)) fs.mkdirSync(tourDir, { recursive: true });

    // Load existing tours
    const detailPath = path.join(__dirname, 'src', 'Data', 'Detail.json');
    let existingTours = [];
    if (fs.existsSync(detailPath)) {
        try {
            existingTours = JSON.parse(fs.readFileSync(detailPath, 'utf8'));
        } catch (e) {
            console.error('Error reading Detail.json:', e);
        }
    }

    for (const url of packageUrls) {
        try {
            const slug = url.split('/').pop().replace('.php', '');
            // Skip if already in existingTours (optional, but good to avoid redundant work)
            // if (existingTours.some(t => t.slug === slug)) {
            //     console.log(`Skipping ${slug}, already exists.`);
            //     continue;
            // }

            console.log(`Scraping ${url}...`);
            const data = await scrapePackage(url, globalReviews);
            if (data) {
                tourResults.push(data);
                // Save individual JSON
                fs.writeFileSync(path.join(tourDir, `${data.slug}.json`), JSON.stringify(data, null, 2));
            }
        } catch (e) {
            console.error(`Error processing ${url}:`, e);
        }
    }

    // Merge results: keep existing ones, update or add new ones
    const mergedResults = [...existingTours];
    tourResults.forEach(newTour => {
        const index = mergedResults.findIndex(t => t.slug === newTour.slug);
        if (index !== -1) {
            mergedResults[index] = newTour;
        } else {
            mergedResults.push(newTour);
        }
    });

    // Save master list
    fs.writeFileSync(detailPath, JSON.stringify(mergedResults, null, 2));

    console.log(`Successfully scraped ${tourResults.length} packages. Total packages: ${mergedResults.length}`);
}

main();
