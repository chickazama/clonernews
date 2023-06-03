import * as client from "./client.js";

const msInterval = 5000;

let currentMaxItemId = 0;

window.addEventListener("load", async () => {
    setInterval(fixedUpdateAsync, msInterval);
})

async function fixedUpdateAsync() {
    let maxItemId = await client.getMaxItemIdAsync();
    if (maxItemId == currentMaxItemId) {
        // console.log("Same ID");
        return;
    }
    currentMaxItemId = maxItemId;
    console.log(`${currentMaxItemId}`);
}