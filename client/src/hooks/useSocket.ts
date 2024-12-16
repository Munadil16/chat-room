import { useEffect, useRef } from "react";

interface IUseSocket {
    onMessageHandler?: (data: any) => void;
}

export const useSocket = ({ onMessageHandler }: IUseSocket) => {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(import.meta.env.VITE_BACKEND_URL);
        socketRef.current = ws;

        if (onMessageHandler) {
            ws.onmessage = (e) => {
                const parsedData = JSON.parse(e.data);
                onMessageHandler(parsedData);
            };
        }

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (
                ws.readyState === WebSocket.OPEN ||
                ws.readyState === WebSocket.CONNECTING
            ) {
                ws.close();
            }
        };
    }, [onMessageHandler]);

    return socketRef;
};
