import { useNavigate } from "react-router-dom";

export const Header = () => {
    const navigate = useNavigate();

    return (
        <header
            className="fixed top-0 z-50 w-full cursor-pointer select-none px-6 py-4 text-2xl font-medium text-purple-500"
            onClick={() => navigate("/")}
        >
            Chat Room
        </header>
    );
};
