import { useCourseSchedule } from "@/hooks/useCourseSchedule";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import OfferingsTableSkeleton from "./OfferingsTableSkeleton";
import TableContent from "../ui/table-content";

export default function OfferingsTable({ courseCode }: { courseCode: string }) {
	const { data, loading, error } = useCourseSchedule(courseCode);

	if (loading) return <OfferingsTableSkeleton />
	if (error) return <p className="text-red-400 text-sm p-4 text-center">{error}</p>;
	if (!data.length) return <p className="text-zinc-600 text-sm p-4 text-center">No sections found.</p>


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
					<TableHead className="w-30 text-xs font-semibold tracking-widest uppercase text-zinc-500 pb-3">Modality</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((course) => (
					<TableContent 
						course={course.course}
						section={course.section}
						professor={course.professor}
						time={course.schedule.time}
						room={course.schedule.room}
						days={course.schedule.days}
						enrolled={course.enrolled}
						capacity={course.capacity}
						remarks={course.remarks}
					/>
				))}
			</TableBody>
		</Table>
	);
}