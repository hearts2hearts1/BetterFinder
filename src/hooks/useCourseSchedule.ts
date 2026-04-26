import { useState, useEffect } from "react";

type Schedule = {
    time: string[];
    room: string;
    days: string;
};

type CourseRow = {
    course: string;
    section: string;
    professor: string;
    schedule: Schedule;
    enrolled: number;
    capacity: number;
    remarks: string;
};

export function useCourseSchedule(courseCode: string) {
    const [data, setData] = useState<CourseRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!courseCode) return;

        setLoading(true);
        chrome.runtime.sendMessage(
            { type: "FETCH_COURSE", courseCode },
            (response) => {
                if (chrome.runtime.lastError) {
                    setError(chrome.runtime.lastError.message ?? "Unknown error");
                    setLoading(false);
                    return;
                }
                if (response?.success) {
                    setData(response.data);
                } else {
                    setError("Failed to fetch schedules");
                }
                setLoading(false);
            }
        );
    }, [courseCode]);

    return { data, loading, error };
}