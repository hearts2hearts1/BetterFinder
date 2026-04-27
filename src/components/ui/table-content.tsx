import { Badge } from "./badge";
import { TableCell, TableRow } from "./table";

interface TableContentProps {
    course: string;
    section: string;
    professor: string;
    time: string[];
    room: string;
    days: string;
    enrolled: number;
    capacity: number;
    remarks: string;
}

export default function TableContent(props: TableContentProps) {
    return (
        <TableRow
            key={`${props.course}-${props.section}`}
            className={`h-15 border-b border-zinc-900 hover:bg-zinc-900/60 transition-colors duration-150 group ${props.capacity === props.enrolled ? "bg-red-950/50" : ""
                }`}
        >
            <TableCell className="font-mono text-sm text-zinc-100 font-medium">
                {props.section}
            </TableCell>

            <TableCell className="max-w-60">
                <span className="block truncate text-sm text-zinc-200" title={props.professor}>
                    {props.professor}
                </span>
            </TableCell>

            <TableCell className="align-middle">
                <div className="flex flex-col gap-1 justify-center h-full">
                    {props.time.map((t, i) => (
                        <Badge
                            key={i}
                            className="bg-zinc-900 text-zinc-400 border border-zinc-700 w-28 justify-center font-mono text-xs group-hover:border-zinc-600 transition-colors"
                        >
                            {t}
                        </Badge>
                    ))}
                </div>
            </TableCell>

            <TableCell className="text-sm text-zinc-300 font-mono">
                {props.room}
            </TableCell>

            <TableCell className="text-sm text-zinc-300">
                {props.days}
            </TableCell>

            <TableCell>
                <span className="text-sm font-mono text-zinc-300">
                    {props.enrolled}
                    <span className="text-zinc-600">/</span>
                    {props.capacity}
                </span>
            </TableCell>

            <TableCell className="text-sm text-zinc-500 italic">
                {props.remarks}
            </TableCell>
        </TableRow>
    )
}