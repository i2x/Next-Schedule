async function updateBadge() {
  let response = await fetch("schedule.json");
  let schedule = await response.json();

  let now = new Date();
  let current_day_of_week = now.getUTCDay();
  let current_hour = now.getUTCHours();
  let current_minutes = now.getUTCMinutes();

  let current_total_minutes =
    current_day_of_week * 1440 + current_hour * 60 + current_minutes;
  let schedule_in_minutes = schedule.map(
    ({ day, start }) => day * 1440 + start * 60
  );
  let diffs = schedule_in_minutes.map(
    (item) =>
      (item < current_total_minutes ? item + 7 * 1440 : item) -
      current_total_minutes
  );
  let min_diff = Math.min(...diffs);
  let current_index = diffs.indexOf(min_diff);

  let min_diff_hours = Math.floor(min_diff / 60);
  let min_diff_minutes = min_diff % 60;
  let time_to_next_schedule = `${min_diff_hours
    .toString()
    .padStart(2, "0")}:${min_diff_minutes.toString().padStart(2, "0")}`;

  chrome.action.setBadgeText({ text: time_to_next_schedule });
  // chrome.storage.local.set({subject_info: schedule[current_index]});

  chrome.storage.local.set({
    data: {
      schedule: schedule,
      current_index: current_index,
    },
  });
}

chrome.action.setBadgeBackgroundColor({ color: "#282C34" }); // set background color
chrome.action.setBadgeTextColor({ color: "#E5C07B" }); // set text color
// Update the badge when Chrome starts up
chrome.runtime.onStartup.addListener(updateBadge);

// Update the badge when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("updateBadge", { periodInMinutes: 1 });
});

// Update the badge periodically
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateBadge") {
    updateBadge();
  }
});
