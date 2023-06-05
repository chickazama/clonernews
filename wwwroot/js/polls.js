import * as client from "./client.js";

async function pollExampleAsync() {
    let postsDiv = document.getElementById("posts");
    let x = document.createElement("div");
    // x.classList.add("post-item");
    const itemId = 126809;
    let data = null;
    while (data === null) {
        data = await client.getItemAsync(itemId);
    }
    let t = document.createElement("h3");
    let tt = document.createTextNode(data.title);
    t.appendChild(tt);
    x.appendChild(t);
    // console.log(data);
    for (const id of data.parts) {
        let data = await client.getItemAsync(id);
        let h = document.createElement("h5");
        let hT = document.createTextNode(data.text);
        let s = document.createElement("p");
        let sT = document.createTextNode(data.score);
        h.appendChild(hT);
        s.appendChild(sT);
        x.appendChild(h);
        x.appendChild(s);
    }
    postsDiv.appendChild(x);
    return data;
}

window.addEventListener("load", async () => {
    await pollExampleAsync();
})