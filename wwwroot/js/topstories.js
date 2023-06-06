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
    // Guard against null data with retry
    let topStoriesIds = null;
    while (topStoriesIds === null) {
        topStoriesIds = await client.getTopStoriesIdAsync();
    }
    // If there are new top stories, update our array, adjust
    // the ID numbers to be displayed, and re-populate the page
    if (topStoriesIds[0] != currentTopStoriesIds[0]) {
        currentTopStoriesIds = topStoriesIds;
        scopedStoriesIds = setScopedStoriesIds(startScopedIdx);
        await populateAsync();
    }
    // Get the ID number of the newest item
    let maxItemId = null;
    while (maxItemId === null) {
        maxItemId = await client.getMaxItemIdAsync();
    }
    // If there are no new items - we are done
    if (maxItemId == currentMaxItemId) {
        return;
    }
    // Walk through each of the new items - if it is a comment
    // on one of the posts currently on display, add it and render
    // the stories again
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
    }
    currentMaxItemId = maxItemId;
}

// This function is responsible for populating the DOM with each post
async function populateAsync() {
    const postsDiv = document.getElementById("posts");
    postsDiv.innerHTML = "";
    // Concurrently build each post asynchronously to smash the loading times.
    // Way faster than using a for loop
    const promises = scopedStoriesIds.map( (storyId) => {
        return shared.buildPostAsync(storyId);
    })
    // Once all the promises have returned a post item,
    // append each of them to the display
    const posts = await Promise.all(promises);
    for (const post of posts) {
        postsDiv.appendChild(post);
    }
}

// Slices out only the ID numbers of the stories which should be currently displayed
function setScopedStoriesIds(startIdx, endIdx = startIdx + scopeLength) {
    return currentTopStoriesIds.slice(startIdx, endIdx);
}