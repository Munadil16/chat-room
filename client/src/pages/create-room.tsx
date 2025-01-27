import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useRecoilState } from "recoil";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { userAtom } from "@/store/atoms/user";
import { useSocket } from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface ICreateRoomResponse {
    roomId: string;
    userId: string;
    message: string;
}

export const CreateRoom = () => {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userAtom);
    const [loading, setLoading] = useState<boolean>(false);
    const [isServerDown, setIsServerDown] = useState<boolean>(false);

    const onMessageHandler = ({
        roomId,
        userId,
        message,
    }: ICreateRoomResponse) => {
        setLoading(false);
        toast.success(message);
        setUser({ ...user, roomId, userId });
        navigate("/room/chat");
    };

    const ws = useSocket({ onMessageHandler });

    const handleCreateRoom = async () => {
        setLoading(true);

        if (!user.name.trim()) {
            toast.error("Name is required");
            setLoading(false);
            return;
        }

        // Render's spin up
        const maxTries = 10;
        const retryDelay = 5000;

        for (let attempt = 0; attempt < maxTries; attempt++) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(
                    JSON.stringify({
                        type: "create",
                        payload: { name: user.name },
                    })
                );

                setIsServerDown(false);
                return;
            }

            setIsServerDown(true);
            await new Promise((r) => setTimeout(r, retryDelay));
        }

        toast.error("Server is down. Try again.");
        setLoading(false);
    };

    useEffect(() => {
        if (isServerDown) {
            toast.error("Render-kun is waking up. Should not take more than 30 seconds. Please wait!", { duration: 10000 });
        }
    }, [isServerDown]);

    return (
        <main className="flex h-[90dvh] items-center justify-center">
            <section className="flex flex-col items-center gap-5">
                <h1 className="text-4xl font-medium sm:text-5xl">
                    Create a <span className="text-violet-600">room</span>
                </h1>

                <Input
                    placeholder="Enter your name"
                    value={user.name}
                    onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                    }
                />

                <Button
                    className="w-full select-none bg-violet-400 text-lg font-medium hover:bg-violet-300"
                    onClick={async () => await handleCreateRoom()}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            Creating <Loader className="animate-spin" />
                        </>
                    ) : (
                        "Create"
                    )}
                </Button>

                <p className="text-sm text-white/80">
                    (Currently each room can only have 2 participants)
                </p>

                <p>
                    Join a room?
                    <Link
                        to={"/room/join"}
                        className="ml-2 font-semibold text-violet-600 underline"
                    >
                        Join
                    </Link>
                </p>
            </section>
        </main>
    );
};
