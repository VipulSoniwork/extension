// Function to get stored signatures and settings
async function getStoredSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['signOffs', 'autoInsert', 'defaultSignoff'], (result) => {
      resolve({
        signOffs: result.signOffs || [],
        autoInsert: result.autoInsert || false,
        defaultSignoff: result.defaultSignoff || ''
      });
    });
  });
}

// Function to get random or default signature
function getSignature(signOffs, defaultSignoff) {
  if (defaultSignoff && signOffs.includes(defaultSignoff)) {
    return defaultSignoff;
  }
  return signOffs[Math.floor(Math.random() * signOffs.length)];
}

// Function to insert signature
async function insertSignature(composeWindow) {
  const settings = await getStoredSettings();
  
  if (!settings.autoInsert || settings.signOffs.length === 0) {
    return;
  }

  setTimeout(() => {
    const emailBody = composeWindow.querySelector('[role="textbox"]');
    if (emailBody && !emailBody.dataset.signatureAdded) {
      const signature = getSignature(settings.signOffs, settings.defaultSignoff);
      
      // Insert HTML signature
      emailBody.focus();
      const range = document.createRange();
      range.selectNodeContents(emailBody);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      document.execCommand('insertHTML', false, `\n\n${signature}`);
      
      // Mark as processed
      emailBody.dataset.signatureAdded = 'true';
    }
  }, 1000);
}

// Observer to watch for new compose windows
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        const composeWindow = node.querySelector('[role="dialog"]');
        if (composeWindow) {
          insertSignature(composeWindow);
        }
      }
    });
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
}); 