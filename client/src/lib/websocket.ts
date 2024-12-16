let ws: WebSocket | null = null;

export const initWebSocketConnection = (url: string) => {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
        ws = new WebSocket(url);

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    return ws;
};
