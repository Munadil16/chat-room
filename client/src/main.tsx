import { StrictMode } from "react";
import { RecoilRoot } from "recoil";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "@/index.css";
import App from "@/App";
import { JoinRoom } from "@/pages/join-room";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RecoilRoot>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App />}>
                            <Route path="/room/join" element={<JoinRoom />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
                <Toaster position="top-right" richColors />
            </ThemeProvider>
        </RecoilRoot>
    </StrictMode>
);
