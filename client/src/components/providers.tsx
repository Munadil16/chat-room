import { ReactNode } from "react";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "./theme-provider";

interface IProviders {
    children: ReactNode;
}

export const Providers = ({ children }: IProviders) => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RecoilRoot>
                {children}
            </RecoilRoot>
        </ThemeProvider>
    );
}
