/// <reference lib="webworker" />

self.onmessage = function (event: MessageEvent<string>) {
    try {
        const parsedData = JSON.parse(event.data);
        self.postMessage(parsedData);
    } catch (error) {
        console.error('Error parsing JSON in jsonParser.worker:', error);
        self.postMessage({ error: (error as Error).message });
    }
};
