const CENTRAL_TIME_ZONE = "America/Chicago";

function getCentralDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );

  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return asUtc - date.getTime();
}

function centralWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
) {
  const initial = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const firstOffset = getTimeZoneOffsetMs(initial, CENTRAL_TIME_ZONE);
  const adjusted = new Date(initial.getTime() - firstOffset);
  const secondOffset = getTimeZoneOffsetMs(adjusted, CENTRAL_TIME_ZONE);

  return new Date(initial.getTime() - secondOffset);
}

export function getCentralDateKey(date = new Date()) {
  const { year, month, day } = getCentralDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function chooseRandomCentralWorkdayTime(date = new Date()) {
  const { year, month, day } = getCentralDateParts(date);
  const minutesAfterNine = Math.floor(Math.random() * (7 * 60));
  const hour = 9 + Math.floor(minutesAfterNine / 60);
  const minute = minutesAfterNine % 60;

  return centralWallTimeToUtc(year, month, day, hour, minute);
}
