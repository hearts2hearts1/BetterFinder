import { parseCourseName, parseSchedule } from "./parser.js";

export function transformScheduleData(courseCode, cfData, scheduleData) {
  const scheduleSlots = extractScheduleSlots(scheduleData);
  const parsedCourseNames = scheduleSlots
    .map((item) => parseCourseName(item.COURSE_NAME));

  const remarks = getRemarks(parsedCourseNames);
  const schedule = parseSchedule(cfData.SCHEDULE);
  const room = getRoom(parsedCourseNames, remarks);

  return buildScheduleObject(
    courseCode,
    cfData,
    parsedCourseNames,
    schedule,
    room,
    remarks,
  );
}

function extractScheduleSlots(scheduleData) {
  const slots = [];
  const rooms = new Set();
  
  for (const item of scheduleData) {
    const parsed = parseCourseName(item.COURSE_NAME);
    if (!rooms.has(parsed.room)) {
      rooms.add(parsed.room);
      slots.push(item);
    }
  }

  if (slots.length === 0 && scheduleData.length > 0) {
    slots.push(scheduleData[0]);
  }

  return slots;
}

function isRoom(section) {
  return (
    section.room &&
    section.room.toUpperCase() !== "ONLINE" &&
    section.room.toUpperCase() !== "-"
  );
}

function isOnline(section) {
  return section.room && section.room.toUpperCase() === "ONLINE";
}

function getRemarks(parsedCourseNames) {
  if (parsedCourseNames.length === 1) {
    return isOnline(parsedCourseNames[0]) ? "FOL" : "PIP";
  }

  const hasRoom = parsedCourseNames.some(isRoom);
  const hasOnline = parsedCourseNames.some(isOnline);
  
  if (hasRoom && hasOnline) return "HYB";
  if (!hasRoom) return "FOL";

  return "PIP";
}

function getRoom(parsedCourseNames, remarks) {
  const physicalRooms = [...new Set(
    parsedCourseNames
      .filter(s => s.room && s.room.toUpperCase() !== "ONLINE" && s.room !== "-")
      .map(s => s.room)
  )];

  switch (remarks) {
    case "FOL":
      return "Online";
    case "PIP":
    case "HYB":
      if (physicalRooms.length > 0) {
        return physicalRooms.join(" / ");
      }
      return parsedCourseNames.find(s => s.room && s.room !== "-")?.room || parsedCourseNames[0]?.room;
    default:
      return null;
  }
}

function buildScheduleObject(
  courseCode,
  cfData,
  parsedCourseName,
  schedule,
  room,
  remarks,
) {
  return {
    course: courseCode,
    section: cfData.SECTION_NAME,
    professor: parsedCourseName[0].professor,
    schedule: {
      time: schedule.times,
      room: room,
      days: schedule.days,
    },
    enrolled: cfData.ENLISTED,
    capacity: cfData.CAPACITY,
    remarks: remarks,
  };
}
