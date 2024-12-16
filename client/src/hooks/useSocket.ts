import { useEffect, useMemo } from "react";
import { initWebSocketConnection } from "@/lib/websocket";

interface IUseSocket {
    onMessageHandler?: (data: any) => void;
}

export const useSocket = ({ onMessageHandler }: IUseSocket) => {
    const ws = useMemo(
        () => initWebSocketConnection(import.meta.env.VITE_BACKEND_URL),
        []
    );

    useEffect(() => {
        if (ws && onMessageHandler) {
            const messageHandler = (e: MessageEvent) => {
                const parsedData = JSON.parse(e.data);
                onMessageHandler(parsedData);
            };

            ws.addEventListener("message", messageHandler);

            return () => {
                ws.removeEventListener("message", messageHandler);
            };
        }
    }, [onMessageHandler, ws]);

    return ws;
};
