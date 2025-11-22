chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openArchiveSearch') {
    // Open search URL in new tab
    chrome.tabs.create({
      url: request.url,
      active: true
    });
  }
});
