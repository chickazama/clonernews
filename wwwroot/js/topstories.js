import * as client from "./client.js";
import * as shared from "./shared.js";

const msInterval = 5000;
const scopeLength = 10;
const minStartIdx = 0;
const maxStartIdx = 490;
let currentMaxItemId;
let currentTopStoriesIds;
let scopedStoriesIds;
let startScopedIdx = 0;

window.addEventListener("load", async () => {
    await initAsync();
    await populateAsync();
    let previousBtns = document.getElementsByClassName("previous");
    for (const btn of previousBtns) {
        btn.addEventListener("click", async () => {
            if (startScopedIdx <= minStartIdx) {
                return;
            }
            startScopedIdx -= scopeLength;
            scopedStoriesIds = setScopedStoriesIds(startScopedIdx);
            await populateAsync();
        })
    }
    let nextBtns = document.getElementsByClassName("next");
    for (const btn of nextBtns) {
        btn.addEventListener("click", async () => {
            if (startScopedIdx >= maxStartIdx) {
                return;
            }
            startScopedIdx += scopeLength;
            scopedStoriesIds = setScopedStoriesIds(startScopedIdx);
            await populateAsync();
        })
    }
    setInterval(fixedUpdateAsync, msInterval);
})

// Initialise data structures representing:
//  - Current Max Item ID
//  - Current Array of Newest Story IDs
//  - Current Array of Scoped Story IDs
async function initAsync() {
    currentMaxItemId = await client.getMaxItemIdAsync();
    currentTopStoriesIds = await client.getTopStoriesIdAsync();
    scopedStoriesIds = setScopedStoriesIds(startScopedIdx);
}

// This function is called periodically
// in order to retrieve the latest item ID
// as well as the newest stories
async function fixedUpdateAsync() {
    let topStoriesIds = null;
    while (topStoriesIds === null) {
        topStoriesIds = await client.getTopStoriesIdAsync();
    }

    if (topStoriesIds[0] != currentTopStoriesIds[0]) {
        currentTopStoriesIds = topStoriesIds;
        scopedStoriesIds = setScopedStoriesIds(startScopedIdx);
        await populateAsync();
    }

    let maxItemId = null;
    while (maxItemId === null) {
        maxItemId = await client.getMaxItemIdAsync();
    }

    if (maxItemId == currentMaxItemId) {
        return;
    }

    for (let id = maxItemId; id > currentMaxItemId; id--) {
        let item = null;
        while (item === null) {
            item = await client.getItemAsync(id);
        }
        if (item.type == "comment") {
            for (const sid of scopedStoriesIds) {
                if (sid == item.parent) {
                    await populateAsync();
                    console.log(`Comment ID: ${item.id} on Story ID: ${sid}`);
                }
            }
        }
        // console.log(item);
    }
    currentMaxItemId = maxItemId;
    // console.log(`New Max Item ID: ${currentMaxItemId}`);
}

// This function is responsible for populating the DOM with each post
async function populateAsync() {
    const postsDiv = document.getElementById("posts");
    postsDiv.innerHTML = "";
    const promises = scopedStoriesIds.map( (storyId) => {
        return shared.buildPostAsync(storyId);
    })
    const posts = await Promise.all(promises);
    for (const post of posts) {
        postsDiv.appendChild(post);
    }
}

// Slices out only the ID numbers of the stories which should be currently displayed
function setScopedStoriesIds(startIdx, endIdx = startIdx + scopeLength) {
    return currentTopStoriesIds.slice(startIdx, endIdx);
}