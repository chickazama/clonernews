const baseUrl = "https://hacker-news.firebaseio.com/v0/";
const maxItemEndpoint = "/maxitem.json";
const jobStoriesEndpoint = "/jobstories.json";
const newStoriesEndpoint = "/newstories.json";
const topStoriesEndpoint = "/topstories.json";
const itemPath = "item/";

export let maxItemId = 0;

export async function getMaxItemIdAsync() {
    const url = `${baseUrl}${maxItemEndpoint}`;
    return await getData(url);
}

export async function getItemAsync(itemId) {
    const url = `${baseUrl}${itemPath}${itemId}.json`;
    return await getData(url);
}

export async function getJobStoriesIdAsync() {
    const url = `${baseUrl}${jobStoriesEndpoint}`;
    return await getData(url);
}

export async function getNewStoriesIdAsync() {
    const url = `${baseUrl}${newStoriesEndpoint}`;
    return await getData(url);
}

export async function getTopStoriesIdAsync() {
    const url = `${baseUrl}${topStoriesEndpoint}`;
    return await getData(url);
}

async function getData(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}