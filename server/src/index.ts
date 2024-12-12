import dotenv from "dotenv";
import { randomUUID, UUID } from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";

dotenv.config();

const PORT = (process.env.PORT ?? 3000) as number;
const wss = new WebSocketServer({ port: PORT });

interface IUser {
    name: string;
    userId: string;
    socket: WebSocket;
}

const rooms = new Map<string, Array<IUser>>();

wss.on("connection", (ws) => {
    ws.on("error", (error) => console.error(error));

    ws.on("message", (data) => {
        const parsedData = JSON.parse(data.toString());

        switch (parsedData.type) {
            case "create": {
                const roomId = randomUUID().substring(0, 8);
                const userId = randomUUID().substring(0, 8);
                const name = parsedData.payload?.name;
                rooms.set(roomId, [{ name, userId, socket: ws }]);

                ws.send(
                    JSON.stringify({
                        roomId,
                        userId,
                        message: "Room created successfully",
                    })
                );

                break;
            }

            case "join": {
                const name = parsedData.payload?.name;
                const roomId = parsedData.payload?.roomId;
                const userId = randomUUID().substring(0, 8);
                const room = rooms.get(roomId);

                if (!room) {
                    ws.send(JSON.stringify({ message: "Room not found" }));
                    break;
                }

                if (room.length >= 2) {
                    ws.send(JSON.stringify({ message: "Room is full" }));
                    break;
                }

                rooms.set(roomId, [...room, { name, userId, socket: ws }]);

                ws.send(
                    JSON.stringify({
                        roomId,
                        userId,
                        message: "Room joined successfully",
                    })
                );

                break;
            }

            case "message": {
                const userId = parsedData.payload?.userId;
                const roomId = parsedData.payload?.roomId;
                const message = parsedData.payload?.message;

                const users = rooms.get(roomId);
                const receiver = users?.find((user) => userId != user.userId);
                receiver?.socket.send(JSON.stringify({ message }));

                break;
            }
        }
    });

    ws.on("close", () => {
        console.log("Socket closed");
    });
});
