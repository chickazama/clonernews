import * as client from "./client.js";

const msInterval = 5000;
const scopeLength = 5;

let currentMaxItemId;
let currentNewStoriesIds;
let scopedStoriesIds;
let startScopedIdx = 0;
let endScopedIdx = startScopedIdx + scopeLength;

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
    scopedStoriesIds = setScopedStoriesIds(startScopedIdx);
    console.log(scopedStoriesIds);
}

async function fixedUpdateAsync() {
    let maxItemId = await client.getMaxItemIdAsync();
    if (maxItemId == currentMaxItemId) {
        // console.log("Same ID");
        return;
    }
    let newStoriesIds = await client.getNewStoriesIdAsync();
    // If there is a new story, and we are on the first page,
    // Populate babyyyy
    if (newStoriesIds[0] != currentNewStoriesIds[0]) {
        currentNewStoriesIds = newStoriesIds;
    }
    currentMaxItemId = maxItemId;
    console.log(`${currentMaxItemId}`);
}

function setScopedStoriesIds(startIdx, endIdx = startIdx + scopeLength) {
    return currentNewStoriesIds.slice(startIdx, endIdx);
}

