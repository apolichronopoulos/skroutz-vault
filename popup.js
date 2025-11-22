document.getElementById('searchBtn').addEventListener('click', async () => {
  const productName = document.getElementById('productName').value.trim();
  const productId = document.getElementById('productId').value.trim();
  const statusDiv = document.getElementById('status');

  if (!productName && !productId) {
    showStatus('Please enter a product name or ID', 'error');
    return;
  }

  showStatus('Searching...', 'success');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(tab.id, {
      action: 'searchArchive',
      productName,
      productId
    }, (response) => {
      if (chrome.runtime.lastError) {
        showStatus('Error: Extension not active on this page', 'error');
      } else if (response?.success) {
        showStatus('Search completed! Check the page.', 'success');
      } else {
        showStatus('Search failed. Try again.', 'error');
      }
    });
  } catch (error) {
    showStatus('Error: Make sure you\'re on a Skroutz page', 'error');
  }
});

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
}

// Focus on product name input when popup opens
document.getElementById('productName').focus();
