declare global {
    var window: Window;
    var document: Document;
}

interface Window {
    fetch: typeof globalThis.fetch;
    setTimeout: typeof globalThis.setTimeout;
    clearTimeout: typeof globalThis.clearTimeout;
}

interface Document {
    removeEventListener: (...args: any[]) => void;
    body: object;
}

export {};
