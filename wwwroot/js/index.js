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
        let data = null;
        while (data === null) {
            data = await client.getItemAsync(storyId);
        }
        // console.log(data);
        const div = document.createElement("div");
        div.classList.add("post");
        const heading = document.createElement("h1");
        const headingText = document.createTextNode(`${data.title}`);
        if (data.kids) {
            for (const kid of data.kids) {
                console.log(kid);
            }
        }
        heading.appendChild(headingText);
        div.appendChild(heading);
        posts.appendChild(div);
    } 
}

function setScopedStoriesIds(startIdx, endIdx = startIdx + scopeLength) {
    return currentNewStoriesIds.slice(startIdx, endIdx);
}

