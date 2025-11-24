chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'searchArchive') {
    const { productName } = request;
    
    // Get current domain
    const domain = window.location.hostname;
    const baseUrl = `https://${domain}`;
    
    const query = encodeURIComponent(productName);
    const searchUrl = `${baseUrl}/search?keyphrase=${query}&cf=${query}`;
    
    // Try to find and click archived products filter or open search in new tab
    chrome.runtime.sendMessage({
      action: 'openArchiveSearch',
      url: searchUrl,
      productName: productName
    });
    
    sendResponse({ success: true });
  }
});
