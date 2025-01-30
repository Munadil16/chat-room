import { Loader } from "lucide-react"

export const Loading = () => {
    return (
        <div className="flex min-h-dvh items-center justify-center">
            <Loader className="animate-spin" />
        </div>
    );
}
