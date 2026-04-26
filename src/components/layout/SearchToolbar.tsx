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
        <div className="w-full max-w-xl">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg shadow-black/40 focus-within:border-neutral-600 transition-colors duration-200">
                <Input
                    className="flex-1 min-w-0 bg-transparent border-0 text-neutral-100 placeholder:text-neutral-500 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-1"
                    placeholder="Search Course (e.g. GEETHIC)"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 bg-white hover:bg-neutral-200 px-3 transition-colors duration-150 cursor-pointer"
                    onClick={handleSearch}
                >
                    <Search className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}