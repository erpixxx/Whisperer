const socket = new WebSocket("ws://127.0.0.1:5440"); // TODO

socket.addEventListener('open', () => {
    socket.send(JSON.stringify({ type: 'register', role: 'controller' }));
    console.log('Successfully connected with the server');
});

socket.addEventListener('message', (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.type === 'error') {
            console.error('Error:', data.message);
            return;
        }
        if (data.type === 'scraped-dom') {
            console.log("Received scraped DOM from: ", data.clientId);
            document.getElementById('domFrame').srcdoc = data.content;
        }
        if (data.type === 'replaced_element') {
            changes.push(data);
            console.log('Received replaced element:', data, changes);
        }
    } catch (error) {
        console.error('Unexpected error:', event.data);
    }
});

function sendInjectionMessage() {
    const messageInput = document.getElementById('messageInput');
    const cssSelector = document.getElementById('cssSelector');
    const replaceCheckbox = document.getElementById('replaceCheckbox');

    const message = {
        type: 'inject_message',
        content: messageInput.value,
        selector: cssSelector.value,
        replace: false
    };
    if (replaceCheckbox.checked) message.replace = true;

    socket.send(JSON.stringify(message));
    messageInput.value = '';
    console.log('Sent message to plugin:', message);
}

function wsSendRevertMessage() {
    const message = {
        type: 'revert_message'
    };

    socket.send(JSON.stringify(message));
    console.log('Sent message to plugin:', message);
}