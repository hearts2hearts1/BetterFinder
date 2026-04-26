let courseList = []
let api;
window.addEventListener("load", async () => {
    api = new CourseAPI("7", "135")
    
    courseList = await api.fetchCourseList();
    await api.fetchCourseSchedules("PETHREE")
    chrome.storage.local.set({
        courseList: courseList
    })
});