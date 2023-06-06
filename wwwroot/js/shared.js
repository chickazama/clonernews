import * as client from "./client.js";

// This function takes a parameter corresponding
// to the ID number of an individual item and constructs the post
// to be displayed on the page
export async function buildPostAsync(id) {
    // Guard against null data with retry
    let data = null;
    while (data === null) {
        data = await client.getItemAsync(id);
    }
    // Create a post div to store the content
    const div = document.createElement("div");
    div.classList.add("post");
    // Create a link which opens in a new tab (if it exists)
    const url = document.createElement("a");
    if (data.url) {
        url.href = data.url;
        url.target = "_blank";
    } else {
        url.classList.add("disabled");
    }
    // Create heading element with the title of the post as its text
    const heading = document.createElement("h1");
    const headingText = document.createTextNode(data.title);
    heading.appendChild(headingText);
    // Make the link inner text the title, and add to post div
    url.appendChild(heading);
    div.appendChild(url);
    // Add the post creation time
    const postTime = document.createElement("h5");
    const postTimeText = document.createTextNode(buildTimeString(data.time));
    postTime.appendChild(postTimeText);
    div.appendChild(postTime);
    // If there are no comments, we are done
    if (!data.kids) {
        return div;
    }
    // Create a span element which acts as a comment dropdown
    const commentDropSpan = document.createElement("span");
    commentDropSpan.classList.add("dropdown");
    const commentHeading = document.createElement("h3");
    let commentHeadingText = document.createTextNode(`Show Comments (${data.kids.length})`);
    commentHeading.appendChild(commentHeadingText);
    commentDropSpan.appendChild(commentHeading);
    div.appendChild(commentDropSpan);
    let comments;
    // Add event listener to the comment dropdown element, to hide/show post comments
    commentDropSpan.addEventListener("click", async () => {
        if (!commentDropSpan.classList.contains("opened")) {
            commentDropSpan.classList.add("opened");
            commentHeading.innerText = "Hide Comments";
            if (!comments) {
                const promises = data.kids.map( (childId) => {
                    return buildCommentAsync(childId);
                } )
                comments = await Promise.all(promises);
            }
            for (const comment of comments) {
                div.appendChild(comment);
            }
            
        } else {
            commentDropSpan.classList.remove("opened");
            commentHeading.innerText = `Show Comments (${data.kids.length})`;
            div.innerHTML = '';
            div.appendChild(url);
            div.appendChild(commentDropSpan);
        }
        
    });
    return div;
}

async function buildCommentAsync(commentId, reply = false) {
    let data = null;
    while (data === null) {
        data = await client.getItemAsync(commentId);
    }
    let div = document.createElement("div");
    div.classList.add("comment");
    if (reply) {
        div.classList.add("reply");
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
    const postTime = document.createElement("h5");
    const postTimeText = document.createTextNode(buildTimeString(data.time));
    postTime.appendChild(postTimeText);
    div.appendChild(postTime);
    div.appendChild(comment);
    
    if (!data.kids) {
        return div;
    }
    const repliesDropSpan = document.createElement("span");
    repliesDropSpan.classList.add("dropdown");
    const repliesHeading = document.createElement("h5");
    let repliesText = document.createTextNode(`Show Replies (${data.kids.length})`);
    repliesHeading.appendChild(repliesText);
    repliesDropSpan.appendChild(repliesHeading);
    div.appendChild(repliesDropSpan);
    let replies;
    repliesDropSpan.addEventListener("click", async () => {
        if (!repliesDropSpan.classList.contains("opened")) {
            repliesDropSpan.classList.add("opened");
            repliesHeading.innerText = "Hide Replies";
            if (!replies) {
                const promises = data.kids.map( (childId) => {
                    return buildCommentAsync(childId, true);
                } )
                replies = await Promise.all(promises);
            }
            for (const reply of replies) {
                div.appendChild(reply);
            }
        } else {
            repliesDropSpan.classList.remove("opened");
            repliesHeading.innerText = `Show Replies (${data.kids.length})`;
            div.innerHTML = '';
            div.appendChild(user);
            div.appendChild(comment);
            div.appendChild(repliesDropSpan);
        }
    });
    return div;
}

function decodeHtml(html) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
}

function buildTimeString(unixTime) {
    const cTime = new Date(unixTime*1000);
    const dateStr = `${cTime.getUTCDate()}/${cTime.getUTCMonth()}/${cTime.getUTCFullYear()}`;
    const min = cTime.getUTCMinutes();
    let minStr = `${min}`;
    if (min < 10) {
        minStr = `0${min}`;
    }
    // const sec = cTime.getUTCSeconds();
    // let secStr = `${sec}`;
    // if (sec < 10) {
    //     secStr = `0${sec}`;
    // }
    const timeStr = `${cTime.getUTCHours()}:${minStr}`;
    return `${dateStr} at ${timeStr}`;
}