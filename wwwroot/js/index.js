import * as client from "./client.js";

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
        let div = await buildPostAsync(storyId);
        posts.appendChild(div);
    } 
}

async function buildPostAsync(storyId) {
    let data = null;
    while (data === null) {
        data = await client.getItemAsync(storyId);
    }
    const div = document.createElement("div");
    div.classList.add("post");
    const url = document.createElement("a");
    if (data.url) {
        url.href = data.url;
        url.target = "_blank";
    } else {
        url.classList.add("disabled");
    }
    const heading = document.createElement("h1");
    const headingText = document.createTextNode(`${data.title}`);
    heading.appendChild(headingText);
    url.appendChild(heading);
    div.appendChild(url);
    if (!data.kids) {
        return div;
    }
    for (const id of data.kids) {
        let comment = await buildCommentAsync(id, true);
        div.appendChild(comment);
    }
    return div;
}

async function buildCommentAsync(commentId, thread = false) {
    let data = null;
    while (data === null) {
        data = await client.getItemAsync(commentId);
    }
    let div = document.createElement("div");
    if (thread) {
        div.classList.add("thread");
    } else {
        div.classList.add("comment");
    }
    const user = document.createElement("h3");
    const userText = document.createTextNode(`${data.by}`);
    user.appendChild(userText);
    const comment = document.createElement("p");
    if (data.text) {
        const cleanText = data.text.replace(/<\/?[^>]+(>|$)/g, "");
        const renderedText = decodeHtml(cleanText);
        const commentText = document.createTextNode(renderedText);
        comment.appendChild(commentText);
    } else {
        comment.innerText = "nothing";
    }
    
    div.appendChild(user);
    div.appendChild(comment);
    if (!data.kids) {
        return div;
    }
    for (const id of data.kids) {
        let commentDiv = await buildCommentAsync(id);
        div.appendChild(commentDiv);
    }
    return div;
}

function setScopedStoriesIds(startIdx, endIdx = startIdx + scopeLength) {
    return currentNewStoriesIds.slice(startIdx, endIdx);
}

function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}