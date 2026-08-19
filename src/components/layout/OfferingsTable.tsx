import { useCourseSchedule } from "@/hooks/useCourseSchedule";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import OfferingsTableSkeleton from "./OfferingsTableSkeleton";
import TableContent from "../ui/table-content";
import FilterChip from "../ui/filter-chip";
import { Clock, MapPin, Calendar, Monitor, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function OfferingsTable({ courseCode }: { courseCode: string }) {
	const { data, loading, error } = useCourseSchedule(courseCode);

	const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
	const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  const [selectedProfessors, setSelectedProfessors] = useState<string[]>([]);

	useEffect(() => {
    setSelectedTimes([]);
    setSelectedProfessors([]);
		setSelectedRooms([]);
		setSelectedDays([]);
		setSelectedModalities([]);
	}, [courseCode]);

	if (loading) return <OfferingsTableSkeleton />
	if (error) return <p className="text-red-400 text-sm p-4 text-center">{error}</p>;
	if (!data.length) return <p className="text-zinc-600 text-sm p-4 text-center">No sections found.</p>

	const uniqueTimes = [...new Set(data.flatMap(c => c.schedule.time).filter(Boolean))].sort();
	const uniqueRooms = [...new Set(data.map(c => c.schedule.room).filter(Boolean))].sort();
	const uniqueDays = [...new Set(data.map(c => c.schedule.days).filter(Boolean))].sort();
	const uniqueModalities = [...new Set(data.map(c => c.remarks).filter(Boolean))].sort();
  const uniqueProfessors = [...new Set(data.map(c => c.professor).filter(Boolean))].sort();
	
	const filteredData = data.filter(c => {
		if (selectedTimes.length > 0 && !c.schedule.time.some(t => selectedTimes.includes(t))) return false;
		if (selectedRooms.length > 0 && !selectedRooms.includes(c.schedule.room)) return false;
		if (selectedDays.length > 0 && !selectedDays.includes(c.schedule.days)) return false;
    if (selectedModalities.length > 0 && !selectedModalities.includes(c.remarks)) return false;
    if (selectedProfessors.length > 0 && !selectedProfessors.includes(c.professor)) return false;
		return true;
	});

	const toggleFilter = (setFn: React.Dispatch<React.SetStateAction<string[]>>) => (val: string) => {
		setFn(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2">
				{uniqueTimes.length > 0 && (
					<FilterChip
						filterName="Schedule"
						icon={Clock}
						values={uniqueTimes}
						selectedValues={selectedTimes}
						onToggle={toggleFilter(setSelectedTimes)}
					/>
				)}
				{uniqueRooms.length > 0 && (
					<FilterChip
						filterName="Room"
						icon={MapPin}
						values={uniqueRooms}
						selectedValues={selectedRooms}
						onToggle={toggleFilter(setSelectedRooms)}
					/>
				)}
				{uniqueDays.length > 0 && (
					<FilterChip
						filterName="Days"
						icon={Calendar}
						values={uniqueDays}
						selectedValues={selectedDays}
						onToggle={toggleFilter(setSelectedDays)}
					/>
				)}
				{uniqueModalities.length > 0 && (
					<FilterChip
						filterName="Modality"
						icon={Monitor}
						values={uniqueModalities}
						selectedValues={selectedModalities}
						onToggle={toggleFilter(setSelectedModalities)}
					/>
        )}
        {uniqueProfessors.length > 0 && (
          <FilterChip
            filterName="Professor"
            icon={User}
            values={uniqueProfessors}
            selectedValues={selectedProfessors}
            onToggle={toggleFilter(setSelectedProfessors)}
          />
				)}
			</div>

			<div className="rounded-md border border-zinc-800 overflow-hidden">
				<Table className="w-full border-separate border-spacing-0">
					<TableHeader>
						<TableRow className="border-b border-zinc-800 bg-zinc-900/50">
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
						{filteredData.length > 0 ? (
							filteredData.map((course, idx) => (
								<TableContent 
									key={`${course.section}-${idx}`}
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
							))
						) : (
							<TableRow>
								<td colSpan={7} className="text-center p-8 text-sm text-zinc-500">
									No sections match the selected filters.
								</td>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}