import * as client from "./client.js";

window.addEventListener("load", async () => {
    let maxId = await client.getMaxItemIdAsync();
    console.log(maxId);
    let data = await client.getShowStoriesIdAsync();
    console.log(data);
    // let data = await client.getAskStoriesIdAsync();
    // console.log(data);
    // let data = await client.getJobStoriesIdAsync();
    // console.log(data);
    // let data = await client.getTopStoriesIdAsync();
    // console.log(data);
    // let data = await client.getNewStoriesIdAsync();
    // console.log(data);
    // let data = await client.getItemAsync(client.maxItemId);
    // console.log(data);
})