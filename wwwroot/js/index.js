function myTest() {
    console.log("Test");
}

window.addEventListener("load", () => {
    setInterval(myTest, 1000);
})