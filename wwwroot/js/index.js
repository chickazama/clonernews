import * as client from "./client.js";

window.addEventListener("load", async () => {
    setInterval(latestItemTestAsync, 5000);
})



async function latestItemTestAsync() {
    let maxId = await client.getMaxItemIdAsync();
    console.log(maxId);
    let data = await client.getItemAsync(maxId);
    console.log(data);
}