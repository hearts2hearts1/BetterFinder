import { Github } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="border-b border-neutral-800 shadow-md shadow-black/40">
            <div className="flex max-w-6xl mx-auto px-6 py-4 justify-between items-center">
                <div className="flex gap-1 items-center">
                    <h1 className="text-xl md:text-2xl font-medium tracking-tight cursor-pointer transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">
                        BetterFinder
                    </h1>

                </div>
                
                <a
                    href="https://github.com/hearts2hearts1/BetterFinder"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github className="w-5 h-5 md:w-6 md:h-6 cursor-pointer text-neutral-400 hover:text-white transition-colors" />
                </a>
            </div>
        </nav>
    )
}