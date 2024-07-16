const axios = require('axios');
const cheerio = require('cheerio');
const { Sentencer } = require('sentencer');

async function fetchPage(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        return data;
    } catch (error) {
        console.error(`Error fetching page: ${url}`);
        return null;
    }
}

async function getWebResponse(query) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    
    try {
        // Fetch the search results page
        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        // Load the HTML into cheerio
        const $ = cheerio.load(data);
        
        // Extract search results
        const searchResults = [];
        $('div.g').each((index, element) => {
            const title = $(element).find('h3').text();
            const link = $(element).find('a').attr('href');
            if (title && link) {
                searchResults.push({ title, link });
            }
        });

        // Extract the first sentence containing "noun" from each link
        let firstSentence = '';
        for (const result of searchResults) {
            const pageHtml = await fetchPage(result.link);
            if (pageHtml) {
                const $ = cheerio.load(pageHtml);
                $('body').find('p').each((index, element) => {
                    const text = $(element).text();
                    if (text.toLowerCase().includes('noun')) {
                        // Using sentencer to split text into sentences
                        const sentencesFound = Sentencer.sentences(text);
                        if (sentencesFound.length > 0) {
                            firstSentence = sentencesFound[0]; // Take the first sentence
                            return false; // Exit loop once first sentence is found
                        }
                    }
                });
            }
            if (firstSentence) break; // Exit outer loop once first sentence is found
        }

        // Return the first sentence containing "noun"
        return firstSentence;
        
    } catch (error) {
        console.error(`Error fetching search results: ${searchUrl}`);
        return '';
    }
}

module.exports = { getWebResponse };
