// Function to create signature HTML
function createSignature() {
  return `
    <div class="gmail-signature">
      <p style="font-family: Arial, sans-serif; font-size: 13px; color: #666;">
        Your Name<br>
        Position | Company<br>
        <a href="tel:+1234567890" style="color: #1a73e8; text-decoration: none;">+1 (234) 567-890</a><br>
        <a href="mailto:your.email@company.com" style="color: #1a73e8; text-decoration: none;">your.email@company.com</a>
      </p>
    </div>
  `;
}

// Function to insert signature
function insertSignature(composeWindow) {
  // Wait for the email content area to be ready
  setTimeout(() => {
    const signatureDiv = composeWindow.querySelector('[role="textbox"]');
    if (signatureDiv && !signatureDiv.querySelector('.gmail-signature')) {
      signatureDiv.innerHTML += createSignature();
    }
  }, 1000);
}

// Observer to watch for new compose windows
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) { // Check if it's an element node
        // Look for compose window
        const composeWindow = node.querySelector('[role="dialog"]');
        if (composeWindow) {
          insertSignature(composeWindow);
        }
      }
    });
  });
});

// Start observing the document body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
}); 