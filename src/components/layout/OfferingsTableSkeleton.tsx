import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

function SkeletonBar({ w }: { w: number }) {
	return (
		<div
			className="h-3.5 rounded animate-pulse bg-zinc-800"
			style={{ width: w }}
		/>
	);
}

function SkeletonBadge() {
	return <div className="h-5 w-24 rounded-md animate-pulse bg-zinc-800" />;
}

const rows = [
	{ prof: 140, badges: 2, room: 90, days: 50, enrolled: 40, remarks: 70 },
	{ prof: 110, badges: 1, room: 80, days: 60, enrolled: 36, remarks: 55 },
	{ prof: 160, badges: 2, room: 100, days: 45, enrolled: 40, remarks: 80 },
	{ prof: 125, badges: 1, room: 70, days: 55, enrolled: 36, remarks: 60 },
	{ prof: 150, badges: 2, room: 85, days: 50, enrolled: 40, remarks: 75 },
	{ prof: 130, badges: 1, room: 95, days: 48, enrolled: 36, remarks: 65 },
];

export default function OfferingsTableSkeleton() {
	return (
		<Table className="w-full border-separate border-spacing-0">
			<TableHeader>
				<TableRow className="border-b border-zinc-800">
					{["Section", "Professor", "Schedule", "Room", "Days", "Enrolled", "Remarks"].map((h) => (
						<TableHead key={h} className="text-xs font-semibold tracking-widest uppercase text-zinc-500 pb-3">
							{h}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((r, i) => (
					<TableRow key={i} className="h-15 border-b border-zinc-900">
						<TableCell><SkeletonBar w={i % 2 === 0 ? 48 : 56} /></TableCell>
						<TableCell><SkeletonBar w={r.prof} /></TableCell>
						<TableCell>
							<div className="flex flex-col gap-1">
								{Array.from({ length: r.badges }).map((_, j) => (
									<SkeletonBadge key={j} />
								))}
							</div>
						</TableCell>
						<TableCell><SkeletonBar w={r.room} /></TableCell>
						<TableCell><SkeletonBar w={r.days} /></TableCell>
						<TableCell><SkeletonBar w={r.enrolled} /></TableCell>
						<TableCell><SkeletonBar w={r.remarks} /></TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}