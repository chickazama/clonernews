import * as client from "./client.js";

const msInterval = 5000;
const scopeLength = 5;

let currentMaxItemId;
let currentNewStoriesIds;
let scopedStoriesIds;

window.addEventListener("load", async () => {
    await initAsync();
    setInterval(fixedUpdateAsync, msInterval);
})

// Initialise data structures representing:
//  - Current Max Item ID
//  - Current Array of Newest Story IDs
//  - Current Array of Scoped Story IDs
async function initAsync() {
    currentMaxItemId = await client.getMaxItemIdAsync();
    currentNewStoriesIds = await client.getNewStoriesIdAsync();
    scopedStoriesIds = currentNewStoriesIds.slice(0, scopeLength);
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

