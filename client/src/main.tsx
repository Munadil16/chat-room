import { createRoot } from "react-dom/client";
import { StrictMode, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "@/index.css";
import App from "@/App";

const Home = lazy(() => import("@/pages/home").then(m => ({ default: m.Home })));
const ChatRoom = lazy(() => import("@/pages/chat-room").then(m => ({ default: m.ChatRoom })));
const JoinRoom = lazy(() => import("@/pages/join-room").then(m => ({ default: m.JoinRoom })));
const CreateRoom = lazy(() => import("@/pages/create-room").then(m => ({ default: m.CreateRoom })));

import { Loading } from "@/components/loading";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Providers>
            <BrowserRouter>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path="/" element={<App />}>
                            <Route path="" element={<Home />} />
                            <Route path="room/join" element={<JoinRoom />} />
                            <Route
                                path="room/create"
                                element={<CreateRoom />}
                            />
                            <Route path="room/chat" element={<ChatRoom />} />
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
            <Toaster position="top-right" richColors />
        </Providers>
    </StrictMode>
);
