const REGION_DOMAINS = {
  'gr': 'skroutz.gr',
  'cy': 'skroutz.com.cy',
  'eu': 'skroutz.eu',
  'bg': 'skroutz.bg',
  'ro': 'skroutz.ro',
  'de': 'skroutz.de'
};

document.getElementById('searchBtn').addEventListener('click', async () => {
  const productName = document.getElementById('productName').value.trim();
  const region = document.getElementById('region').value;

  if (!productName) {
    showStatus('Please enter a product name', 'error');
    return;
  }

  showStatus('Searching...', 'success');

  try {
    const domain = REGION_DOMAINS[region];
    const baseUrl = `https://www.${domain}`;
    
    const query = encodeURIComponent(productName);
    const searchUrl = `${baseUrl}/search?keyphrase=${query}&cf=${query}`;
    
    chrome.tabs.create({ url: searchUrl });
    showStatus('Opened search in new tab!', 'success');
  } catch (error) {
    showStatus('Error: Could not open search', 'error');
  }
});

document.getElementById('skuSearchBtn').addEventListener('click', async () => {
  const productName = document.getElementById('productName').value.trim();
  const region = document.getElementById('region').value;

  if (region !== 'gr') {
    showStatus('Skoop search is only available for Greece (GR) region', 'error');
    return;
  }

  if (!productName) {
    showStatus('Please enter a product name', 'error');
    return;
  }

  showStatus('Searching SKU library...', 'success');

  try {
    const domain = REGION_DOMAINS[region];
    const baseUrl = `https://www.${domain}`;
    const query = encodeURIComponent(productName);
    
    const response = await fetch(`${baseUrl}/account/skoop/items/sku_search?keyphrase=${query}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
      const skus = data.map(item => ({
        name: item.sku_name || 'Unknown',
        url: item.sku_url ? `${baseUrl}${item.sku_url}` : '#',
        image: item.sku_main_image || '',
        price: item.price_min || 'N/A',
        category: item.category_name || 'N/A'
      }));

      if (skus.length === 0) {
        showStatus('No SKUs found', 'error');
        return;
      }

      displaySkuResults(skus, baseUrl, productName);
    } else {
      showStatus('No results found', 'error');
    }
  } catch (error) {
    showStatus('You need to have Skoop enabled in your account to use this search.', 'error');
  }
});

function displaySkuResults(skus, baseUrl, query) {
  const popup = window.open('', 'SKU Results', 'width=900,height=600');
  popup.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Skroutz Vault - search - ${query}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        h1 { color: #333; }
        .results { list-style: none; padding: 0; }
        .result-item { 
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 12px; 
          margin: 8px 0; 
          background: white; 
          border-radius: 4px;
          border-left: 4px solid #ff9500;
        }
        .result-image {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
        }
        .result-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 3px;
        }
        .result-content {
          flex: 1;
        }
        .result-item a { 
          color: #0066cc; 
          text-decoration: none;
          word-break: break-word;
        }
        .result-item a:hover { text-decoration: underline; }
        .button-group {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .check-btn { 
          background: #ff9500; 
          color: white !important; 
          border: none; 
          padding: 4px 8px; 
          border-radius: 3px;
          cursor: pointer; 
          font-size: 11px;
          text-decoration: none;
          display: inline-block;
        }
        .check-btn:hover { 
          background: #ff9500;
          color: white !important;
        }
        .check-btn:visited {
          color: white !important;
        }
      </style>
    </head>
    <body>
      <h1>Skroutz Vault 🔍 🎩</h1>
      <h2>Search results for "${query}" (${skus.length} found)</h2>
      <ul class="results">
        ${skus.map((sku, idx) => `
          <li class="result-item">
            ${sku.image ? `<div class="result-image"><img src="https:${sku.image}" alt="${sku.name}" onerror="this.style.display='none'"></div>` : ''}
            <div class="result-content">
              <strong>${sku.name}</strong><br>
              <small style="color: #666;">${sku.category}</small> <small style="color: #999;">|</small> <small style="color: #ff6b35; font-weight: bold;">From: ${sku.price}</small><br>
              <a href="${sku.url}" target="_blank">${sku.url}</a>
              <div class="button-group">
                <a class="check-btn" href="${sku.url}" target="_blank">Check in Skroutz</a>
              </div>
            </div>
          </li>
        `).join('')}
      </ul>
      <script>
      </script>
    </body>
    </html>
  `);
  popup.document.close();
  showStatus('Results displayed in new window!', 'success');
}

document.getElementById('googleBtn').addEventListener('click', () => {
  const productName = document.getElementById('productName').value.trim();
  const region = document.getElementById('region').value;

  if (!productName) {
    showStatus('Please enter a product name', 'error');
    return;
  }

  const domain = REGION_DOMAINS[region];
  const query = encodeURIComponent(`site:${domain} ${productName}`);
  const googleUrl = `https://www.google.com/search?q=${query}`;
  
  chrome.tabs.create({ url: googleUrl });
  showStatus('Opened Google search in new tab!', 'success');
});

document.getElementById('productName').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('skuSearchBtn').click();
  }
});

document.getElementById('region').addEventListener('change', () => {
  const skuBtn = document.getElementById('skuSearchBtn');
  const region = document.getElementById('region').value;
  
  if (region === 'gr') {
    skuBtn.style.display = 'flex';
    skuBtn.disabled = false;
  } else {
    skuBtn.style.display = 'none';
    skuBtn.disabled = true;
  }
});

// Initialize on page load
document.getElementById('region').dispatchEvent(new Event('change'));

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
}

// Focus on product name input when popup opens
document.getElementById('productName').focus();
