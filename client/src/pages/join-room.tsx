import { toast } from "sonner";
import { useRecoilState } from "recoil";
import { useSocket } from "@/hooks/useSocket";
import { Input } from "@/components/ui/input";
import { userAtom } from "@/store/atoms/user";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface IResponse {
    message: string;
    success: boolean;
}

export const JoinRoom = () => {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userAtom);

    const onMessageHandler = ({ success, message }: IResponse) => {
        if (success) {
            toast.success(message);
            navigate("/room/chat");
        } else {
            toast.error(message);
        }
    };

    const ws = useSocket({ onMessageHandler });

    const handleJoinRoom = () => {
        if (!user.name.trim()) {
            toast.error("Name is required");
            return;
        }

        if (!user.roomId.trim()) {
            toast.error("Room id is required");
            return;
        }

        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current?.send(
                JSON.stringify({
                    type: "join",
                    payload: { name: user.name, roomId: user.roomId },
                })
            );
        }
    };

    return (
        <main className="flex h-[90dvh] items-center justify-center">
            <section className="flex flex-col items-center gap-5">
                <h1 className="text-4xl font-medium sm:text-5xl">
                    Join a <span className="text-violet-600">room</span>
                </h1>

                <Input
                    placeholder="Enter your name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />

                <Input
                    placeholder="Enter the room id"
                    value={user.roomId}
                    onChange={(e) =>
                        setUser({ ...user, roomId: e.target.value })
                    }
                />

                <Button
                    className="w-full bg-violet-400 text-lg font-medium hover:bg-violet-300"
                    onClick={handleJoinRoom}
                >
                    Join
                </Button>

                <p>
                    Create a room?
                    <Link
                        to={"/room/create"}
                        className="ml-2 font-semibold text-violet-600 underline"
                    >
                        Create
                    </Link>
                </p>
            </section>
        </main>
    );
};
