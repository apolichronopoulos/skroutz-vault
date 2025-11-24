document.getElementById('searchBtn').addEventListener('click', async () => {
  const productName = document.getElementById('productName').value.trim();
  const region = document.getElementById('region').value;

  if (!productName) {
    showStatus('Please enter a product name', 'error');
    return;
  }

  showStatus('Searching...', 'success');

  try {
    const regionDomains = {
      'gr': 'skroutz.gr',
      'cy': 'skroutz.com.cy',
      'eu': 'skroutz.eu',
      'bg': 'skroutz.bg',
      'ro': 'skroutz.ro',
      'de': 'skroutz.de'
    };

    const domain = regionDomains[region];
    const baseUrl = `https://www.${domain}`;
    
    const query = encodeURIComponent(productName);
    const searchUrl = `${baseUrl}/search?keyphrase=${query}&cf=${query}`;
    
    chrome.tabs.create({ url: searchUrl });
    showStatus('Opened search in new tab!', 'success');
  } catch (error) {
    showStatus('Error: Could not open search', 'error');
  }
});

document.getElementById('productName').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('searchBtn').click();
  }
});

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
}

// Focus on product name input when popup opens
document.getElementById('productName').focus();
