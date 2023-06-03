import * as client from "./client.js";

const msInterval = 5000;

window.addEventListener("load", async () => {
    setInterval(latestItemTestAsync, msInterval);
})

async function latestItemTestAsync() {
    let maxId = await client.getMaxItemIdAsync();
    console.log(maxId);
    let data = await client.getItemAsync(maxId);
    console.log(data);
}