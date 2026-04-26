class CourseAPI {
    constructor(campus, acadSession) {
        this.campus = campus;
        this.acadSession = acadSession;
        this.courseList = []
    }

    getCourseIDByCourseCode(courseCode) {
        const match = this.courseList.find(c =>
            c.COURSE_NAME?.toLowerCase().includes(courseCode.toLowerCase())
        )

        return match ? match.COURSE_CREATION_ID : null
    }

    async fetchCourseList() {
        const params = new URLSearchParams();
        params.append("Campusno", this.campus);
        params.append("AcademicSession", this.acadSession);

        const res = await fetch(
            "https://archershub.dlsu.edu.ph/CourseFinder/GetCourseList/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: params
            }
        )

        const fetchedCourseList = await res.json()
        this.courseList = fetchedCourseList.CourseDrp;
        return this.courseList;
    }

    async fetchCourseSchedules(courseCode) {
        const courseSchedules = []
        const courseID = this.getCourseIDByCourseCode(courseCode)

        if (!courseID) return null;

        const params = new URLSearchParams();
        params.append("Campusno", this.campus);
        params.append("AcademicSession", this.acadSession);
        params.append("Courseid", courseID);

        const cfData = await fetch(
            "https://archershub.dlsu.edu.ph/CourseFinder/GetCFData/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: params
            }
        ) 

        const cf = await cfData.json()
        
        for (const c of cf) {
            const scheduleData = await this.fetchScheduleData(
                c.COURSE_CREATION_ID,
                c.SECTION_CREATION_ID
            );

            courseSchedules.push(
                cleanScheduleData(courseCode, c, scheduleData)
            );
        }

        courseSchedules.forEach(c => {
            console.log(c)
        })

        return courseSchedules;
    }

    async fetchScheduleData(courseCreationID, sectionCreationID) {
        const params = new URLSearchParams();
        params.append("STARTDATE", "2026-04-20");
        params.append("ENDDATE", "2026-04-26");
        params.append("ACADEMICSESSIONID", this.acadSession);

        params.append("enlistmentSchedule[0][COURSE_CREATION_ID]", courseCreationID);
        params.append("enlistmentSchedule[0][SECTION_CREATION_ID]", sectionCreationID);
        params.append("enlistmentSchedule[0][BATCH_CREATION_ID]", "0");
        params.append("enlistmentSchedule[0][CAMPUSNO]", this.campus);

        const res = await fetch(
            "https://archershub.dlsu.edu.ph/CourseFinder/GetScheduleData/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: params
            }
        );

        const data = await res.json()
        return data;
    }
}