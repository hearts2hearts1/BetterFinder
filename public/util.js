function parseSchedule(scheduleStr) {
    const dayMap = {
        MONDAY: "M",
        TUESDAY: "T",
        WEDNESDAY: "W",
        THURSDAY: "H",
        FRIDAY: "F",
        SATURDAY: "S",
    };

    const dayOrder = ["M", "T", "W", "H", "F", "S"];

    const blocks = scheduleStr.match(/\[([^\]]+)\]/g) || [];

    let daysSet = new Set();
    let timesSet = new Set();

    const formatTime = (t) => {
        let [time, meridian] = t.split(" ");
        let [h, m] = time.split(":").map(Number);

        if (meridian === "PM" && h !== 12) h += 12;
        if (meridian === "AM" && h === 12) h = 0;

        return `${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}`;
    };

    for (let block of blocks) {
        const parts = block
            .replace(/[\[\]]/g, "")
            .split(" - ")
            .map(p => p.trim())
            .filter(Boolean);

        const [day, start, end] = parts;
        if (!day || !start || !end) continue;

        const mappedDay = dayMap[day.toUpperCase()];
        if (mappedDay) daysSet.add(mappedDay);

        timesSet.add(`${formatTime(start)}-${formatTime(end)}`);
    }

    return {
        days: dayOrder.filter(d => daysSet.has(d)).join(""),
        times: [...timesSet]
    };
}

function parseCourseName(raw) {
    const text = raw.replace(/<[^>]*>/g, " ");
    const get = (label) => {
        const match = text.match(
            new RegExp(`${label}\\s*:\\s*(.*?)\\s*(?=Room\\s*:|Teacher\\s*:|Co-Teacher\\s*:|Section\\s*:|Batch\\s*:|$)`, "i")
        );
        return match ? match[1].trim() : null;
    };

    return {
        room: get("Room"),
        professor: get("Teacher"),
    };
}

function isRoom(section) {
    return section.room.toUpperCase() !== "ONLINE" && section.room.toUpperCase() !== "-"
}

function getRoom(parsedCourseNames, remarks) {
    const first = parsedCourseNames?.[0];
    const second = parsedCourseNames?.[1];

    switch (remarks) {
        case "FOL": 
            return "Online"
        case "PIP":
            return first?.room
        case "HYB":
            return isRoom(first) ? first?.room : second?.room
        default:
            return null
    }
}

function getRemarks(selected) {
    
    if (selected[1] === undefined) return selected[0].room === "Online" ? "FOL" : "PIP"

    if (isRoom(selected[0]) || isRoom(selected[1])) return "HYB"

    //if (selected[0].room.toUpperCase() === "ONLINE" || selected[0].room.toUpperCase() === "-" && selected[1].room.toUpperCase() !== "ONLINE") return "HYB"
    if (selected[0].room.toUpperCase() !== "ONLINE" && selected[1].room.toUpperCase() === "ONLINE") return "HYB"
    if (selected[0].room.toUpperCase() === "ONLINE" && selected[1].room.toUpperCase() === "ONLINE") return "FOL"
    
    return "PIP"
}


function cleanScheduleData(courseCode, cfData, scheduleData) {
    if (!scheduleData[13]) {
        const parsedCourseName = [parseCourseName(scheduleData[0].COURSE_NAME)]
        const schedule = parseSchedule(cfData.SCHEDULE)
        const remarks =  getRemarks(parsedCourseName)
        const room = getRoom(parsedCourseName, remarks)
        return {
            course: courseCode,
            section: cfData.SECTION_NAME,
            professor: parsedCourseName[0].professor,
            schedule: {
                time: schedule.times,
                room: room,
                days: schedule.days
            },
            enrolled: cfData.ENLISTED,
            capacity: cfData.CAPACITY,
            remarks: remarks   
        }
    }

    const selected = [scheduleData[0], scheduleData[13]]
    const parsedCourseNames = selected
        .slice(0,2)
        .map(item => parseCourseName(item.COURSE_NAME))
    const remarks =  getRemarks(parsedCourseNames)
    const schedule = parseSchedule(cfData.SCHEDULE)
    const room = getRoom(parsedCourseNames, remarks)
    return {
        course: courseCode,
        section: cfData.SECTION_NAME,
        professor: parsedCourseNames[0].professor,
        schedule: {
            time: schedule.times,
            room: room,
            days: schedule.days
        },
        enrolled: cfData.ENLISTED,
        capacity: cfData.CAPACITY,
        remarks: remarks
    }
}