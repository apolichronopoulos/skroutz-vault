chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'searchArchive') {
    const { productName, productId } = request;
    
    // Get current domain
    const domain = window.location.hostname;
    const baseUrl = `https://${domain}`;
    
    // Build search URL based on whether we have ID or just name
    let searchUrl;
    if (productId) {
      searchUrl = `${baseUrl}/products/${productId}`;
    } else {
      const query = encodeURIComponent(productName);
      searchUrl = `${baseUrl}/search?keyphrase=${encodeURIComponent(query)}`;
    }
    
    // Try to find and click archived products filter or open search in new tab
    chrome.runtime.sendMessage({
      action: 'openArchiveSearch',
      url: searchUrl,
      productName: productName
    });
    
    sendResponse({ success: true });
  }
});
