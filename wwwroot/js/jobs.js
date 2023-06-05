import * as client from "./client.js";
import * as shared from "./shared.js";

const msInterval = 5000;
const scopeLength = 10;
const minStartIdx = 0;
const maxStartIdx = 490;
let currentMaxItemId;
let currentJobStoriesIds;
let scopedStoriesIds;
let startScopedIdx = 0;
let endScopedIdx = startScopedIdx + scopeLength;

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
    currentJobStoriesIds = await client.getJobStoriesIdAsync();
    scopedStoriesIds = setScopedStoriesIds(startScopedIdx);
}

// This function is called periodically
// in order to retrieve the latest item ID
// as well as the newest stories
async function fixedUpdateAsync() {
    let jobStoriesIds = null;
    while (jobStoriesIds === null) {
        jobStoriesIds = await client.getJobStoriesIdAsync();
    }

    if (jobStoriesIds[0] != currentJobStoriesIds[0]) {
        currentJobStoriesIds = jobStoriesIds;
        scopedStoriesIds = setScopedStoriesIds(startScopedIdx);
        await populateAsync();
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

function setScopedStoriesIds(startIdx, endIdx = startIdx + scopeLength) {
    return currentJobStoriesIds.slice(startIdx, endIdx);
}