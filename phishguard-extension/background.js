// Service worker — keeping it minimal for now
// Can be extended later for badge counts, notifications, etc.

chrome.runtime.onInstalled.addListener(() => {
  console.log('PhishGuard extension installed.');
});