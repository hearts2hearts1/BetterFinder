export function parseSchedule(scheduleStr) {
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

    let entries = [];
    let seenDays = new Set();

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
        if (!mappedDay) continue;

        seenDays.add(mappedDay);
        entries.push({ day: mappedDay, time: `${formatTime(start)}-${formatTime(end)}` });
    }

    entries.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

    return {
        days: dayOrder.filter(d => seenDays.has(d)).join(""),
        times: [...new Set(entries.map(e => e.time))]
    };
}

export function parseCourseName(raw) {
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
