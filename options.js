// Initialize storage
let signOffs = [];
let autoInsert = false;
let defaultSignoff = '';

// Save settings to chrome.storage
function saveSettings() {
    chrome.storage.local.set({
        signOffs,
        autoInsert,
        defaultSignoff
    });
}

// Load settings from chrome.storage
function loadSettings() {
    chrome.storage.local.get(['signOffs', 'autoInsert', 'defaultSignoff'], (result) => {
        signOffs = result.signOffs || [
            "Best regards,\nYuriy",
            "Sincerely,\nYuriy",
            "Kind regards,\nYuriy",
            "Warm regards,\nYuriy"
        ];
        autoInsert = result.autoInsert || false;
        defaultSignoff = result.defaultSignoff || '';
        
        updateUI();
    });
}

function updateUI() {
    const list = document.getElementById('signoff-list');
    const select = document.getElementById('default-signoff');
    
    list.innerHTML = '';
    select.innerHTML = '<option value="">Random</option>';
    
    signOffs.forEach((html, index) => {
        // Create signature item
        const div = document.createElement('div');
        div.className = 'flex items-center gap-2 bg-gray-50 p-2 rounded-md';
        
        const editor = document.createElement('div');
        editor.contentEditable = true;
        editor.innerHTML = html;
        editor.className = 'flex-grow border rounded-md p-2';
        editor.onblur = () => {
            signOffs[index] = editor.innerHTML;
            saveSettings();
            updateUI();
        };
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.className = 'text-red-500 hover:text-red-700 font-bold text-xl px-3 py-1';
        removeBtn.onclick = () => {
            signOffs.splice(index, 1);
            saveSettings();
            updateUI();
        };
        
        div.appendChild(editor);
        div.appendChild(removeBtn);
        list.appendChild(div);
        
        // Update select options
        const option = document.createElement('option');
        option.value = html;
        option.textContent = html.replace(/<[^>]*>/g, '').substring(0, 30) + '...';
        option.selected = html === defaultSignoff;
        select.appendChild(option);
    });
    
    document.getElementById('auto-insert').checked = autoInsert;
}

// Event Listeners
document.getElementById('auto-insert').addEventListener('change', function() {
    autoInsert = this.checked;
    saveSettings();
});

document.getElementById('default-signoff').addEventListener('change', function() {
    defaultSignoff = this.value;
    saveSettings();
});

// Text styling functions
function initializeStyleButtons() {
    const editor = document.getElementById('signature-editor');
    
    // Ensure editor is focused when clicking style buttons
    document.querySelectorAll('.style-btn').forEach(btn => {
        if (btn.tagName !== 'INPUT' && btn.tagName !== 'SELECT') {
            btn.addEventListener('mousedown', function(e) {
                e.preventDefault(); // Prevent losing focus from editor
            });
        }
    });

    // Style buttons
    document.querySelectorAll('[data-style]').forEach(btn => {
        btn.addEventListener('click', function() {
            editor.focus(); // Ensure editor has focus
            document.execCommand(this.dataset.style, false);
            this.classList.toggle('active');
        });
    });

    // Font family
    document.getElementById('font-family').addEventListener('change', function() {
        editor.focus();
        document.execCommand('fontName', false, this.value);
    });

    // Font size
    document.getElementById('font-size').addEventListener('change', function() {
        editor.focus();
        const size = this.value.replace('px', '');
        // Convert px to size 1-7
        const sizeMap = {
            '12': 1,
            '14': 2,
            '16': 3,
            '18': 4
        };
        document.execCommand('fontSize', false, sizeMap[size] || 2);
    });

    // Font color
    document.getElementById('font-color').addEventListener('input', function() {
        editor.focus();
        document.execCommand('foreColor', false, this.value);
    });

    // Make sure editor keeps formatting when pasting
    editor.addEventListener('paste', function(e) {
        e.preventDefault();
        const text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initializeStyleButtons();
    
    // Add button event listener
    document.getElementById('add-signature-btn').addEventListener('click', () => {
        const editor = document.getElementById('signature-editor');
        const html = editor.innerHTML.trim();
        
        if (html) {
            signOffs.push(html);
            saveSettings();
            editor.innerHTML = '';
            updateUI();
        }
    });
});

// Remove or comment out the window.addSignOff function since we don't need it anymore
/* window.addSignOff = function() {
    const editor = document.getElementById('signature-editor');
    const html = editor.innerHTML.trim();
    
    if (html) {
        signOffs.push(html);
        saveSettings();
        editor.innerHTML = '';
        updateUI();
    }
}; */ 