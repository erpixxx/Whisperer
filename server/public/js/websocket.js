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
            createNewConnection(data);
        }
        if (data.type === 'disconnect') {
            console.log('Client disconnected:', data.clientId);
            removeConnection(data.clientId);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
});

function createNewConnection(data) {
    const connections = document.querySelector(".connections");
    const selectList = document.getElementById("connection-select");
    console.log(selectList);

    const existingConnection = document.getElementById("connection-" + data.clientId);
    if (existingConnection) {
        const iframe = existingConnection.querySelector("iframe");
        iframe.srcdoc = data.content;
        return;
    }

    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("connection");
    fieldset.id = "connection-" + data.clientId;
    const legend = document.createElement("legend");
    legend.textContent = data.clientId;
    const div = document.createElement("div");
    div.classList.add("connection-preview");
    const iframe = document.createElement("iframe");
    iframe.classList.add("connection-preview__iframe");
    iframe.id = data.clientId;
    iframe.srcdoc = data.content;
    const option = document.createElement("option");
    option.value = data.clientId;
    option.textContent = data.clientId;

    div.appendChild(iframe);
    fieldset.appendChild(legend);
    fieldset.appendChild(div);
    connections.appendChild(fieldset);
    selectList.appendChild(option);
}

function removeConnection(clientId) {
    const connection = document.getElementById("connection-" + clientId);
    const selectList = document.getElementById("connection-select");
    if (connection) {
        connection.remove();
        selectList.querySelector(`option[value="${clientId}"]`).remove();
    }
}

function sendInjectionMessage() {
    const messageInput = document.getElementById('messageInput');
    const connection = document.getElementById('connection-select').value;
    const cssSelector = document.getElementById('cssSelector');
    const replaceCheckbox = document.getElementById('replaceCheckbox');

    const message = {
        type: 'inject_message',
        target: connection,
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
    const connection = document.getElementById('connection-select').value;
    const message = {
        type: 'revert_message',
        target: connection
    };

    socket.send(JSON.stringify(message));
    console.log('Sent message to plugin:', message);
}