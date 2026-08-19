import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

type Props = {
    onSearch: (courseCode: string) => void;
};

export default function SearchToolbar({ onSearch }: Props) {
    const [value, setValue] = useState("");

    const handleSearch = () => {
        if (value.trim()) onSearch(value.trim().toUpperCase());
    };

    return (
        <div className="w-full max-w-md mx-4">
            <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-900 border border-neutral-800 focus-within:border-neutral-600 transition-colors duration-200">
                <Input
                    className="flex-1 min-w-0 bg-transparent border-0 text-neutral-100 placeholder:text-neutral-500 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-3 h-8"
                    placeholder="Search Course (e.g. GEETHIC)"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0 h-8 w-8 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    onClick={handleSearch}
                >
                    <Search className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}