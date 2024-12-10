import dotenv from "dotenv";
import { WebSocketServer } from "ws";

dotenv.config();

const PORT = (process.env.PORT ?? 3000) as number;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
    ws.on("error", (error) => console.error(error));

    ws.on("message", (data) => {
        console.log(data.toString());
    });

    ws.send("Hello from server");
});
