import { toast } from "sonner";
import { useRecoilState } from "recoil";
import { userAtom } from "@/store/atoms/user";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Send, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AyaseImage from "@/assets/images/ayase.jpeg";
import OkarunImage from "@/assets/images/okarun.jpeg";
import { messagesAtom } from "@/store/atoms/messages";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface IChatRoomResponse {
    message: string;
    userId: string;
}

export const ChatRoom = () => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState<string>("");
    const [user, setUser] = useRecoilState(userAtom);
    const chatRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useRecoilState(messagesAtom);
    const [showEmojiModal, setShowEmojiModal] = useState<boolean>(false);

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
                    payload: {
                        userId: user.userId,
                        roomId: user.roomId,
                        message: msg,
                    },
                })
            );
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            { message: msg, userId: user.userId },
        ]);

        setMsg("");
    };

    const copyRoomId = () => {
        navigator.clipboard
            .writeText(user.roomId)
            .then(() => toast.success("Room id copied to clipboard"));
    };

    const handleEmojiClick = (emojiObject: EmojiClickData) => {
        setMsg((prevMsg) => prevMsg + emojiObject.emoji);
        setShowEmojiModal(false);
    };

    const handleExitClick = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: "close",
                    payload: { roomId: user.roomId, userId: user.userId },
                })
            );

            setUser({ name: "", roomId: "", userId: "" });

            navigate("/");
        }
    };

    useEffect(() => {
        if (!user.roomId.trim()) {
            navigate("/");
        }
    }, [user.roomId, navigate]);

    useEffect(() => {
        const handleBeforeUnload = (_e: BeforeUnloadEvent) => {
            handleExitClick();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <main className="flex h-dvh items-center justify-center">
            <section className="flex h-[95dvh] w-[90vw] flex-col justify-between overflow-y-scroll scroll-smooth rounded-3xl border scrollbar-hide sm:h-[80dvh] sm:w-[60vw] md:w-[45vw] lg:w-[40vw] xl:w-[35vw]">
                {/* RoomId bar and Chatbox */}
                <div>
                    <div className="sticky top-0 z-50 mb-2 flex items-center justify-between border-b bg-zinc-950 p-4">
                        <p className="flex items-center rounded-t-3xl text-lg font-medium">
                            Room ID:
                            <span className="ml-2 text-white/80">
                                {user.roomId}
                            </span>
                            <Copy
                                className="ml-2 w-4 cursor-pointer hover:text-white/80"
                                onClick={copyRoomId}
                            />
                        </p>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="bg-purple-400 px-5 text-base font-medium hover:bg-purple-300"
                                    size={"sm"}
                                >
                                    Exit
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You will redirected to Home page and
                                        your chat history will be deleted
                                        forever.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleExitClick}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    {messages.map((message, index) => {
                        if (message.userId === user.userId) {
                            return (
                                <div
                                    key={index}
                                    className="flex items-end justify-end gap-2 px-3 py-1"
                                >
                                    <p className="w-fit max-w-[60%] break-words rounded-t-2xl rounded-bl-2xl rounded-br-sm bg-purple-500 px-3 py-1 text-lg font-medium">
                                        {message.message}
                                    </p>

                                    <img
                                        className="w-7 select-none rounded-full"
                                        src={AyaseImage}
                                        alt="Ayase momo pfp"
                                    />
                                </div>
                            );
                        }

                        return (
                            <div
                                key={index}
                                className="flex items-end justify-start gap-2 px-3 py-1"
                            >
                                <img
                                    className="w-7 select-none rounded-full"
                                    src={OkarunImage}
                                    alt="Ayase momo pfp"
                                />

                                <p className="w-fit max-w-[60%] break-words rounded-t-2xl rounded-bl-sm rounded-br-2xl bg-neutral-800 px-3 py-1 text-lg font-medium">
                                    {message.message}
                                </p>
                            </div>
                        );
                    })}

                    <div ref={chatRef}></div>
                </div>

                {/* Text-box */}
                <div className="sticky bottom-0 mt-2 flex items-center bg-zinc-900 px-5 py-2">
                    <Smile
                        className="w-6 cursor-pointer text-purple-500"
                        onClick={() => setShowEmojiModal(!showEmojiModal)}
                    />

                    {showEmojiModal && (
                        <div className="absolute bottom-14 z-50">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}

                    <Input
                        className="rounded-xl border-0 bg-inherit text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter a message"
                        autoFocus
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key == "Enter") {
                                handleSendMessage();
                            }
                        }}
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
