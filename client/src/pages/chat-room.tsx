import { toast } from "sonner";
import { useState } from "react";
import { Send } from "lucide-react";
import { userAtom } from "@/store/atoms/user";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/useSocket";
import { messagesAtom } from "@/store/atoms/messages";
import { useRecoilState, useRecoilValue } from "recoil";

interface IChatRoomResponse {
    message: string;
    userId: string;
}

export const ChatRoom = () => {
    const [msg, setMsg] = useState<string>("");
    const { userId, roomId } = useRecoilValue(userAtom);
    const [messages, setMessages] = useRecoilState(messagesAtom);

    const onMessageHandler = ({ message, userId }: IChatRoomResponse) => {
        setMessages((prevMessages) => [...prevMessages, { message, userId }]);
    };

    const ws = useSocket({ onMessageHandler });

    const handleSendMessage = () => {
        if (!msg.trim()) {
            toast.error("Message is required");
            return;
        }

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: "message",
                    payload: { userId, roomId, message: msg },
                })
            );
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            { message: msg, userId },
        ]);

        setMsg("");
    };

    return (
        <main className="flex h-dvh items-center justify-center">
            <section className="flex h-[95dvh] w-[90vw] flex-col justify-between overflow-y-scroll scroll-smooth rounded-3xl border scrollbar-hide sm:h-[75dvh] sm:w-[55vw] md:w-[40vw] lg:w-[35vw] xl:w-[30vw]">
                <div>
                    <p className="sticky top-0 z-50 mb-2 flex items-center rounded-t-3xl border-b bg-zinc-950 p-4 pl-4 text-lg font-medium">
                        Room ID:
                        <span className="ml-2 text-white/80">{roomId}</span>
                    </p>

                    {messages.map((message, index) => {
                        if (message.userId === userId) {
                            return (
                                <div
                                    key={index}
                                    className="flex justify-end px-3 py-1"
                                >
                                    <p className="w-fit max-w-[60%] break-all rounded-lg bg-purple-500 px-3 py-1 text-lg font-medium">
                                        {message.message}
                                    </p>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={index}
                                className="flex justify-start px-3 py-1"
                            >
                                <p className="w-fit max-w-[60%] break-all rounded-lg bg-neutral-900 px-3 py-1 text-lg font-medium">
                                    {message.message}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="sticky bottom-0 flex items-center bg-zinc-900 px-5 py-2">
                    <Input
                        className="rounded-xl border-0 bg-inherit text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter a message"
                        autoFocus
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />

                    <Send
                        className="cursor-pointer font-semibold text-purple-500"
                        onClick={handleSendMessage}
                    />
                </div>
            </section>
        </main>
    );
};
