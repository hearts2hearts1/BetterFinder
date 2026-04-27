import { parseCourseName, parseSchedule } from "./parser.js"

function extractScheduleSlots(scheduleData) {
    // one day scheds
    if (!scheduleData[13]) {
        return [scheduleData[0]];
    }

    // 3 units, two day scheds
    if (!scheduleData[28]) {
        return [scheduleData[0], scheduleData[13]];
    }

    // 5 units, four day scheds
    return [scheduleData[0], scheduleData[28]];
}

function isRoom(section) {
    return section.room.toUpperCase() !== "ONLINE" && section.room.toUpperCase() !== "-"
}

function getRemarks(selected) {
    if (selected[1] === undefined) return selected[0].room === "Online" ? "FOL" : "PIP"
    if (isRoom(selected[0]) || isRoom(selected[1])) return "HYB"
    if (!isRoom(selected[0]) || !isRoom(selected[1])) return "FOL"

    return "PIP"
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

function buildScheduleObject(courseCode, cfData, parsedCourseName, schedule, room, remarks) {
    return {
        course: courseCode,
        section: cfData.SECTION_NAME,
        professor:parsedCourseName[0].professor,
        schedule: {
            time: schedule.times,
            room: room,
            days: schedule.days
        },
        enrolled: cfData.ENLISTED,
        capacity: cfData.CAPACITY,
        remarks: remarks,
    }
}

export function transformScheduleData(courseCode, cfData, scheduleData) {
    const scheduleSlots = extractScheduleSlots(scheduleData)
    const parsedCourseNames = scheduleSlots
        .slice(0,2)
        .map(item => parseCourseName(item.COURSE_NAME))
    
    const remarks = getRemarks(parsedCourseNames)
    const schedule = parseSchedule(cfData.SCHEDULE)
    const room = getRoom(parsedCourseNames, remarks)

    return buildScheduleObject(
        courseCode,
        cfData,
        parsedCourseNames,
        schedule,
        room,
        remarks
    )
}