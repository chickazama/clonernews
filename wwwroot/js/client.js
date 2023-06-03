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

export async function getMaxItemIdAsync() {
    return await getData(maxItemUrl);
}

export async function getItemAsync(itemId) {
    const url = `${baseUrl}${itemPath}${itemId}.json`;
    return await getData(url);
}

export async function getAskStoriesIdAsync() {
    return await getData(askStoriesUrl);
}

export async function getJobStoriesIdAsync() {
    return await getData(jobStoriesUrl);
}

export async function getNewStoriesIdAsync() {
    return await getData(newStoriesUrl);
}

export async function getShowStoriesIdAsync() {
    return await getData(showStoriesUrl);
}

export async function getTopStoriesIdAsync() {
    return await getData(topStoriesUrl);
}

async function getData(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}