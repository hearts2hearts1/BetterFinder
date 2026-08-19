import { type LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Field, FieldGroup, FieldLabel } from "./field";
import { Checkbox } from "./checkbox";

interface FilterChipProps {
    filterName: string;
    values: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
    icon?: LucideIcon;
}

export default function FilterChip({ filterName, values, selectedValues, onToggle, icon: Icon }: FilterChipProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    {filterName}
                    {selectedValues.length > 0 && (
                        <span className="ml-1 rounded-full bg-neutral-200 text-neutral-900 px-2 py-0.5 text-xs font-bold">
                            {selectedValues.length}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="max-h-80 overflow-y-auto">
                <FieldGroup>
                        {values.map((v) => (
                            <Field key={v} orientation="horizontal">
                                <Checkbox
                                    id={`filter-${v}`}
                                    name={`filter-${v}`}
                                    checked={selectedValues.includes(v)}
                                    onCheckedChange={() => onToggle(v)}
                                />
   
                                <FieldLabel
                                    htmlFor={`filter-${v}`}
                                    className="font-normal flex-none cursor-pointer"
                                >
                                    {v}
                                </FieldLabel>
                            </Field>
                        ))}
                </FieldGroup>
            </PopoverContent>
        </Popover>
    );
}