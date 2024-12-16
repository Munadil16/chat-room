import { atom } from "recoil";

interface IMessage {
    message: string;
    userId: string;
}

export const messagesAtom = atom<IMessage[]>({
    key: "messagesAtom",
    default: [{ message: "", userId: "" }],
});
