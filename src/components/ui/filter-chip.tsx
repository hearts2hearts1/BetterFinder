import { type LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Field, FieldGroup, FieldLabel } from "./field";
import { Checkbox } from "./checkbox";

interface FilterChipProps {
    filterName: string;
    values: string[],
    icon?: LucideIcon
}

export default function FilterChip({ filterName, values, icon: Icon }: FilterChipProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    {filterName}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start">
                <FieldGroup>
                        {values.map((v) => (
                            <Field key={v} orientation="horizontal">
                                <Checkbox
                                    id={`filter-${v}`}
                                    name={`filter-${v}`}
                                />
   
                                <FieldLabel
                                    htmlFor={`filter-${v}`}
                                    className="font-normal flex-none"
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