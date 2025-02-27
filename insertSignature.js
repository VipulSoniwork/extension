(function() {
    const signOffs = [
        "Best regards,\nYuriy Goldberg",
        "Sincerely,\nYuriy Goldberg",
        "Kind regards,\nYuriy Goldberg",
        "Warm regards,\nYuriy Goldberg",
        "Cheers,\nYuriy Goldberg",
        "Yours truly,\nYuriy Goldberg",
        "Take care,\nYuriy Goldberg",
        "All the best,\nYuriy Goldberg",
        "Respectfully,\nYuriy Goldberg"
    ];

    function insertSignOff() {
        let emailBody = document.querySelector('[aria-label="Message Body"], div[role="textbox"]');
        
        if (emailBody) {
            let randomSignOff = "\n\n" + signOffs[Math.floor(Math.random() * signOffs.length)];

            // Move cursor to the end of the email body
            emailBody.focus();

            // Create an input event to simulate typing (bypasses Gmail's security)
            let event = new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: randomSignOff });
            emailBody.dispatchEvent(event);

            // Insert text directly
            document.execCommand("insertText", false, randomSignOff);
        } else {
            console.warn("Could not find email body. Make sure you're composing an email.");
        }
    }

    insertSignOff();
})();
