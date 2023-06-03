const baseUrl = "https://hacker-news.firebaseio.com/v0/";
const maxItemEndpoint = "/maxitem.json";
const newStoriesEndpoint = "/newstories.json";
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

export async function getNewStoriesIdAsync() {
    const url = `${baseUrl}${newStoriesEndpoint}`;
    return await getData(url);
}

async function getData(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}