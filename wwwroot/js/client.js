const baseUrl = "https://hacker-news.firebaseio.com/v0/";
const maxItemEndpoint = "/maxitem.json";

export let maxItemId = 0;

export async function getMaxItemIdAsync() {
    const url = baseUrl + maxItemEndpoint;
    const res = await fetch(url);
    const data = await res.json();
    maxItemId = data;
    // console.log(data);
}

// export async function getItemAsync() {

// }