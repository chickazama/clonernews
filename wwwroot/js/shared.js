import * as client from "./client.js";

export async function buildPostAsync(id) {
    let data = null;
    while (data === null) {
        data = await client.getItemAsync(id);
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
    const commentHeading = document.createElement("h3");
    const commentHeadingText = document.createTextNode(`Comments (${data.kids.length})`);
    commentHeading.appendChild(commentHeadingText);
    div.appendChild(commentHeading);
    const promises = data.kids.map( (childId) => {
        return buildCommentAsync(childId, true);
    })
    const comments = await Promise.all(promises);
    for (const comment of comments) {
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
    const promises = data.kids.map( (childId) => {
        return buildCommentAsync(childId);
    })
    const replies = await Promise.all(promises);
    for (const reply of replies) {
        div.appendChild(reply);
    }
    return div;
}

function decodeHtml(html) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
}