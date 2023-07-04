function updateBadge() {
    let now = new Date();
    let current_day_of_week = now.getUTCDay();
    let current_hour = now.getUTCHours();
    let current_minutes = now.getUTCMinutes();
    
    const schedule = [
        {day:1,start:3,end:5},
        {day:1,start:8,end:9},
        {day:2,start:6,end:10},
        {day:3,start:2,end:5},
        {day:4,start:2,end:5},
        {day:4,start:6,end:9},
        {day:5,start:1,end:3},
        {day:5,start:6,end:9},
    ];

    let current_total_minutes = current_day_of_week * 1440 + current_hour * 60 + current_minutes;
    let schedule_in_minutes = schedule.map(({day, start}) => day * 1440 + start * 60);
    let diffs = schedule_in_minutes.map(item => (item < current_total_minutes ? item + 7 * 1440 : item) - current_total_minutes);
    let min_diff = Math.min(...diffs);
    let min_diff_hours = Math.floor(min_diff / 60);
    let min_diff_minutes = min_diff % 60;
    let time_to_next_schedule = `${min_diff_hours.toString().padStart(2, '0')}:${min_diff_minutes.toString().padStart(2, '0')}`;

    chrome.action.setBadgeText({text:time_to_next_schedule});
}


chrome.action.setBadgeBackgroundColor({color: "#282c34"}); // set background color
chrome.action.setBadgeTextColor({color: "#e5c07b"}); // set text color 


// Update the badge when Chrome starts up
chrome.runtime.onStartup.addListener(updateBadge);

// Update the badge when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('updateBadge', {periodInMinutes: 1});
});

// Update the badge periodically
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateBadge') {
    updateBadge();
  }
});
