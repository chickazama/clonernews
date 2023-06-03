import * as client from "./client.js";

const msInterval = 5000;

let currentMaxItemId = 0;
let currentNewStoriesIds = [];

window.addEventListener("load", async () => {
    await initAsync();
    setInterval(fixedUpdateAsync, msInterval);
})

async function initAsync() {
    currentMaxItemId = await client.getMaxItemIdAsync();
    currentNewStoriesIds = await client.getNewStoriesIdAsync();
}
async function fixedUpdateAsync() {
    let maxItemId = await client.getMaxItemIdAsync();
    if (maxItemId == currentMaxItemId) {
        // console.log("Same ID");
        return;
    }
    let newStoriesIds = await client.getNewStoriesIdAsync();
    if (newStoriesIds[0] != currentNewStoriesIds[0]) {
        
    }
    currentMaxItemId = maxItemId;
    console.log(`${currentMaxItemId}`);
}

