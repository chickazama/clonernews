import { myTest } from "./test.js";
import * as client from "./client.js";

window.addEventListener("load", async () => {
    let maxId = await client.getMaxItemIdAsync();
    console.log(maxId);
    let data = await client.getNewStoriesIdAsync();
    console.log(data);
    // let data = await client.getItemAsync(client.maxItemId);
    // console.log(data);
})