import { toast } from "sonner";
import { useRecoilState } from "recoil";
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

    const onMessageHandler = ({
        roomId,
        userId,
        message,
    }: ICreateRoomResponse) => {
        toast.success(message);
        setUser({ ...user, roomId, userId });
        navigate("/room/chat");
    };

    const ws = useSocket({ onMessageHandler });

    const handleCreateRoom = () => {
        if (!user.name.trim()) {
            toast.error("Name is required");
        }

        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(
                JSON.stringify({ type: "create", payload: { name: user.name } })
            );
        }
    };

    return (
        <main className="flex h-[90dvh] items-center justify-center">
            <section className="flex flex-col items-center gap-5">
                <h1 className="text-4xl font-medium sm:text-5xl">
                    Create a <span className="text-violet-600">room</span>
                </h1>

                <Input
                    placeholder="Enter your name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />

                <Button
                    className="w-full bg-violet-400 text-lg font-medium hover:bg-violet-300"
                    onClick={handleCreateRoom}
                >
                    Create
                </Button>

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
