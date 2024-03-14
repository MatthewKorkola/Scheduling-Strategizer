let intervalId; // Declare intervalId outside the message event handler

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', event => {
    const { type } = event.data;

    if (type === 'start' && !intervalId) {
        intervalId = setInterval(() => {
            // Notify the main thread on each tick
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({ type: 'tick' });
        }, 1000);
    } else if (type === 'stop' && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
});
