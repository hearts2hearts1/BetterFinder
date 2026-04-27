import { CourseAPI } from "./api.js";

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "FETCH_COURSE") {
        (async () => {
            const api = new CourseAPI("7", "135");
            await api.fetchCourseList();
            const schedules = await api.fetchCourseSchedules(request.courseCode);

            console.log("COURSE:", request.courseCode);
            console.log("RAW:", schedules);

            const safeSchedules = (schedules || [])
                .filter(Boolean)
                .map(item => ({
                    ...item,
                    schedule: {
                        time: item?.schedule?.time || [],
                        days: item?.schedule?.days || "",
                        room: item?.schedule?.room || ""
                    }
                }));

            console.log("SANITIZED:", safeSchedules);

            sendResponse({
                success: true,
                data: safeSchedules
            });
        })();

        return true;
    }
});