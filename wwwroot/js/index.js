import * as client from "./client.js";
import * as shared from "./shared.js";

const msInterval = 5000;
const scopeLength = 10;
const minStartIdx = 0;
const maxStartIdx = 490;
let currentMaxItemId;
let currentNewStoriesIds;
let scopedStoriesIds;
let startScopedIdx = 0;
let endScopedIdx = startScopedIdx + scopeLength;

window.addEventListener("load", async () => {
    await initAsync();
    let previousBtns = document.getElementsByClassName("previous");
    for (const btn of previousBtns) {
        btn.addEventListener("click", async () => {
            if (startScopedIdx <= minStartIdx) {
                return;
            }
            startScopedIdx -= 10;
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
            startScopedIdx += 10;
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
    currentNewStoriesIds = await client.getNewStoriesIdAsync();
    scopedStoriesIds = setScopedStoriesIds(startScopedIdx);
    await populateAsync();
    // console.log(scopedStoriesIds);
}

// This function is called periodically
// in order to retrieve the latest item ID
// as well as the newest stories
async function fixedUpdateAsync() {
    let newStoriesIds = null;
    while (newStoriesIds === null) {
        newStoriesIds = await client.getNewStoriesIdAsync();
    }

    if (newStoriesIds[0] != currentNewStoriesIds[0]) {
        currentNewStoriesIds = newStoriesIds;
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
        console.log(item);
    }
    currentMaxItemId = maxItemId;
    console.log(`New Max Item ID: ${currentMaxItemId}`);
}

// This function is responsible for populating the DOM with each post
async function populateAsync() {
    const posts = document.getElementById("posts");
    posts.innerHTML = "";
    for (const storyId of scopedStoriesIds) {
        let div = await shared.buildPostAsync(storyId);
        posts.appendChild(div);
    } 
}

function setScopedStoriesIds(startIdx, endIdx = startIdx + scopeLength) {
    return currentNewStoriesIds.slice(startIdx, endIdx);
}