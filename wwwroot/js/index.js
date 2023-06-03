import { myTest } from "./test.js";
import * as client from "./client.js";

window.addEventListener("load", async () => {
    await client.getMaxItemIdAsync();
    console.log(client.maxItemId);
})