import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import OfferingsTable from "./components/layout/OfferingsTable";
import SearchToolbar from "./components/layout/SearchToolbar";

export default function App() {
	const [courseCode, setCourseCode] = useState("")
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />

			<div className="flex mt-2.5 items-center justify-center">
				<SearchToolbar onSearch={setCourseCode} />
			</div>

			<div className="mt-4 px-5 max-w-7xl mx-auto w-full">
				<OfferingsTable courseCode={courseCode} />
			</div>

		</div>
	)
}