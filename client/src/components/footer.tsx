import { X } from "./svg-icons/x";
import { Link } from "react-router-dom";
import { Github } from "./svg-icons/github";

export const Footer = () => {
    return (
        <footer className="flex items-center justify-between px-6 py-5">
            <p className="font-medium text-black">Made by Munadil</p>

            <div className="flex items-center gap-6">
                <Link to={"https://x.com/munadil_xd"} target="_blank">
                    <X className="w-6" />
                </Link>

                <Link
                    to={"https://github.com/Munadil16/chat-room"}
                    target="_blank"
                >
                    <Github className="w-6" />
                </Link>
            </div>
        </footer>
    );
};
