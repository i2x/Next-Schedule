chrome.storage.local.get(["subject_info"], function (result) {
  if (result.subject_info) {
    document.getElementById("subject-name").innerText = `${result.subject_info.name}
    ${result.subject_info.id} S.${result.subject_info.sec}
    ${result.subject_info.room}
    ${result.subject_info.date}`;
  }
});
