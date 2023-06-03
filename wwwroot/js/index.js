import { myTest } from "./test.js";
import * as client from "./client.js";

window.addEventListener("load", async () => {
    await client.getMaxItemIdAsync();
    console.log(client.maxItemId);
    let data = await client.getItemAsync(client.maxItemId);
    console.log(data);
})