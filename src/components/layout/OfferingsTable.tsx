import { useCourseSchedule } from "@/hooks/useCourseSchedule";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";


export default function OfferingsTable({ courseCode }: { courseCode: string }) {
	const { data, loading, error } = useCourseSchedule(courseCode);

	if (loading) return <p className="text-zinc-500 text-sm p-4">Loading schedules...</p>;
	if (error)   return <p className="text-red-400 text-sm p-4">{error}</p>;
	if (!data.length) return <p className="text-zinc-600 text-sm p-4">No sections found.</p>;

	return (
		<Table className="w-full border-separate border-spacing-0">
			<TableHeader>
				<TableRow className="border-b border-zinc-800">
					<TableHead className="whitespace-nowrap w-20 text-xs font-semibold tracking-widest uppercase text-zinc-500 pb-3">Section</TableHead>
					<TableHead className="w-60 text-xs font-semibold tracking-widest uppercase text-zinc-500 pb-3">Professor</TableHead>
					<TableHead className="w-45 text-xs font-semibold tracking-widest uppercase text-zinc-500 pb-3">Schedule</TableHead>
					<TableHead className="w-40 text-xs font-semibold tracking-widest uppercase text-zinc-500 pb-3">Room</TableHead>
					<TableHead className="w-30 text-xs font-semibold tracking-widest uppercase text-zinc-500 pb-3">Days</TableHead>
					<TableHead className="w-30 text-xs font-semibold tracking-widest uppercase text-zinc-500 pb-3">Enrolled</TableHead>
					<TableHead className="w-30 text-xs font-semibold tracking-widest uppercase text-zinc-500 pb-3">Remarks</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((course) => (
					<TableRow
						key={`${course.course}-${course.section}`}
						className={`h-15 border-b border-zinc-900 hover:bg-zinc-900/60 transition-colors duration-150 group ${
							course.capacity === course.enrolled ? "bg-red-950/50" : ""
						}`}
					>
						<TableCell className="font-mono text-sm text-zinc-100 font-medium">
							{course.section}
						</TableCell>

						<TableCell className="max-w-60">
							<span className="block truncate text-sm text-zinc-200" title={course.professor}>
								{course.professor}
							</span>
						</TableCell>

						<TableCell className="align-middle">
							<div className="flex flex-col gap-1 justify-center h-full">
								{course.schedule.time.map((t, i) => (
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
							{course.schedule.room}
						</TableCell>

						<TableCell className="text-sm text-zinc-300">
							{course.schedule.days}
						</TableCell>

						<TableCell>
							<span className="text-sm font-mono text-zinc-300">
								{course.enrolled}
								<span className="text-zinc-600">/</span>
								{course.capacity}
							</span>
						</TableCell>

						<TableCell className="text-sm text-zinc-500 italic">
							{course.remarks}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}