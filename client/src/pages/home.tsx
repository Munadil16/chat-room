import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import JoinRoomImage from "@/assets/images/joinroom.png";
import ChatRoomImage from "@/assets/images/chatroom.png";
import { ShinyButton } from "@/components/ui/shiny-button";
import CreateRoomImage from "@/assets/images/createroom.png";

export const Home = () => {
    const navigate = useNavigate();

    return (
        <main>
            <Header />

            <img
                className="fixed left-0 top-0 -z-10 h-screen w-full"
                src={"/background.jpg"}
                alt="bacgkround image"
                loading="eager"
            />

            <section className="flex h-[90dvh] flex-col items-center justify-center gap-6 text-center sm:h-[65dvh]">
                <h1 className="w-[90vw] text-balance font-serif text-6xl tracking-tight text-black/80 sm:w-[70vw] sm:leading-[0.9] md:text-8xl">
                    Temporary{" "}
                    <span className="bg-[linear-gradient(90deg,rgba(224,_227,_255,_0)_0%,#485aff80_70%)]">
                        spaces
                    </span>
                    , lasting connections.
                </h1>

                <p className="w-[90vw] text-balance text-lg font-medium text-black/70 sm:w-[70vw]">
                    Temporary rooms for effortless chats that disappear when
                    you're done. Perfect for spontaneous, short-lived
                    connections.
                </p>

                <div className="flex items-center gap-5">
                    <Button
                        className="text-base font-medium"
                        onClick={() => navigate("/room/create")}
                    >
                        Create a room
                    </Button>

                    <ShinyButton
                        className="bg-black text-base font-medium"
                        onClick={() => navigate("/room/join")}
                    >
                        Join a room
                    </ShinyButton>
                </div>
            </section>

            <section className="hidden items-center justify-center sm:flex">
                <img
                    className="relative left-10 w-32 rounded-3xl border border-white sm:left-20 sm:w-56 md:w-64 lg:w-72"
                    src={CreateRoomImage}
                    alt="Create room image"
                    loading="eager"
                />

                <img
                    className="z-50 w-32 rounded-3xl border border-white sm:w-56 md:w-64 lg:w-72"
                    src={ChatRoomImage}
                    alt="Chat room image"
                    loading="eager"
                />

                <img
                    className="relative right-10 w-32 rounded-3xl border border-white sm:right-20 sm:w-56 md:w-64 lg:w-72"
                    src={JoinRoomImage}
                    alt="Join room image"
                    loading="eager"
                />
            </section>

            <Footer />
        </main>
    );
};
