// API Endpoint & Path Constants
const maxItemEndpoint = "/maxitem.json";
const askStoriesEndpoint = "/askstories.json";
const jobStoriesEndpoint = "/jobstories.json";
const newStoriesEndpoint = "/newstories.json";
const showStoriesEndpoint = "showstories.json";
const topStoriesEndpoint = "/topstories.json";
const itemPath = "item/";

// API URL constants
const baseUrl = "https://hacker-news.firebaseio.com/v0/";
const maxItemUrl = `${baseUrl}${maxItemEndpoint}`;
const askStoriesUrl = `${baseUrl}${askStoriesEndpoint}`;
const jobStoriesUrl = `${baseUrl}${jobStoriesEndpoint}`;
const newStoriesUrl = `${baseUrl}${newStoriesEndpoint}`;
const showStoriesUrl = `${baseUrl}${showStoriesEndpoint}`;
const topStoriesUrl = `${baseUrl}${topStoriesEndpoint}`;

// Exported functions for retrieving data from the API asynchronously.
// Each of these makes use of the generalised private 'getDataAsync' function.

export async function getMaxItemIdAsync() {
    return await getDataAsync(maxItemUrl);
}

export async function getItemAsync(itemId) {
    const url = `${baseUrl}${itemPath}${itemId}.json`;
    return await getDataAsync(url);
}

export async function getAskStoriesIdAsync() {
    return await getDataAsync(askStoriesUrl);
}

export async function getJobStoriesIdAsync() {
    return await getDataAsync(jobStoriesUrl);
}

export async function getNewStoriesIdAsync() {
    return await getDataAsync(newStoriesUrl);
}

export async function getShowStoriesIdAsync() {
    return await getDataAsync(showStoriesUrl);
}

export async function getTopStoriesIdAsync() {
    return await getDataAsync(topStoriesUrl);
}

// Generalised function for getting data from a URL
async function getDataAsync(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("Failed to retrieve data from API");
        return null;
    }
    
}