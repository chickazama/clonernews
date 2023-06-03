const baseUrl = "https://hacker-news.firebaseio.com/v0/";
const maxItemEndpoint = "/maxitem.json";
const newStoriesEndpoint = "/newstories.json";
const itemPath = "item/";

export let maxItemId = 0;

export async function getMaxItemIdAsync() {
    const url = `${baseUrl}${maxItemEndpoint}`;
    const res = await fetch(url);
    const data = await res.json();
    maxItemId = data;
    return maxItemId;
}

export async function getItemAsync(itemId) {
    const url = `${baseUrl}${itemPath}${itemId}.json`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export async function getNewStoriesIdAsync() {
    const url = `${baseUrl}${newStoriesEndpoint}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}