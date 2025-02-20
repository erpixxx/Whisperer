const whispererSocket = new WebSocket('ws://127.0.0.1:5440'); // TODO
let lastChangedElement;
let lastChangedElementCloned;

whispererSocket.onopen = () => {
    console.log('[Whisperer]: Connected to the WebSocket server');
    whispererSocket.send(JSON.stringify({ type: 'register', role: 'plugin' }));
};

whispererSocket.onerror = (error) => {
    console.error('[Whisperer]: Unexpected error:', error);
};

whispererSocket.onclose = () => {
    console.log('[Whisperer]: Websocket connection closed');
};

window.addEventListener('beforeunload', () => {
    whispererSocket.close();
});

window.addEventListener('unload', () => {
    whispererSocket.close();
});

whispererSocket.addEventListener('message', (event) => {
    try {
        const data = JSON.parse(event.data);

        if (data.type === 'inject_message') {
            let element = document.querySelector(data.selector);
            if (element) {
                lastChangedElementCloned = element.cloneNode(true);
                if (data.replace) {
                    element.innerHTML = data.content;
                } else {
                    element.innerHTML += data.content;
                }
                lastChangedElement = element;
                scrape();
            } else {
                console.warn('[Whisperer]: Cannot find CSS selector:', data.selector);
            }
        }
        if (data.type === 'revert_message') {
            if (lastChangedElement && lastChangedElementCloned) {
                lastChangedElement.replaceWith(lastChangedElementCloned);
                lastChangedElement = lastChangedElementCloned;
            }
            scrape();
        }
    } catch (error) {
        console.log('[Whisperer]: Cannot handle message:', event.data);
    }
});

async function scrape() {
    const html = document.documentElement.outerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    Array.from(doc.querySelectorAll('script')).forEach(script => script.remove());

    const styles = await Promise.all(
        Array.from(doc.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(async (element) => {
                if (element.tagName === 'STYLE') {
                    return element.outerHTML;
                }
                try {
                    const response = await fetch(element.href);
                    const css = await response.text();
                    return `<style>${css}</style>`;
                } catch (error) {
                    return '';
                }
            })
    );

    const head = doc.querySelector('head') || doc.createElement('head');
    head.innerHTML = styles.join('\n') + head.innerHTML;
    doc.documentElement.prepend(head);

    whispererSocket.send(JSON.stringify({
        type: 'scraped-dom',
        content: doc.documentElement.outerHTML
    }));
}

setInterval(scrape, 5000);
window.addEventListener('load', () => {
    scrape();
});