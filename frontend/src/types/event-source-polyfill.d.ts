declare module 'event-source-polyfill' {
    export class EventSourcePolyfill {
        constructor(url: string, config?: { headers?: Record<string, string>; heartbeatTimeout?: number });
        onopen: (event: Event) => void;
        onmessage: (event: MessageEvent) => void;
        onerror: (event: Event) => void;
        close: () => void;
    }
}