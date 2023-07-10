let current_index = 0;
let schedule = [];
async function getStoredData() {
    let store = await chrome.storage.local.get(["data"]);
    schedule = store.data.schedule;
    current_index = store.data.current_index;
}
async function render() {
    let result = schedule[current_index];
    document.getElementById(
        "subject-name"
    ).innerText = `${result.name}\n${result.id} S.${result.sec}\n${result.room} \n${result.date}`;
}

document.getElementById("btnBack").addEventListener("click", async function () {
    current_index = Math.max(current_index - 1, 0);
    await render();
});

document.getElementById("btnNow").addEventListener("click", async function () {
    let store = await chrome.storage.local.get(["data"]);
    current_index = store.data.current_index;
    await render();
});

document.getElementById("btnNext").addEventListener("click", async function () {
    current_index = Math.min(current_index + 1, schedule.length - 1);
    await render();
});

(async function init() {
    await getStoredData();
    await render();
})();
