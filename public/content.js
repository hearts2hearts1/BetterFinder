let courseList = []
let api;
window.addEventListener("load", async () => {
    api = new CourseAPI("7", "135")
    
    courseList = await api.fetchCourseList();
    chrome.storage.local.set({
        courseList: courseList
    })
});