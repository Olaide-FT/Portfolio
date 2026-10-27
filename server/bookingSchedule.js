export const bookingTimeZone = "Africa/Lagos";
export const bookingDurationMinutes = 60;
export const bookingTimes = [
  { value: "09:00", label: "09:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "13:00", label: "01:00 PM" },
];

export function getLagosDateParts(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: bookingTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

export function getBookingDates(now = new Date(), days = 8) {
  const { year, month, day } = getLagosDateParts(now);
  const firstDay = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  const dates = [];

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(firstDay);
    date.setUTCDate(firstDay.getUTCDate() + offset);
    const weekday = date.getUTCDay();

    if (weekday === 0 || weekday === 6) continue;

    const dateValue = [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, "0"),
      String(date.getUTCDate()).padStart(2, "0"),
    ].join("-");

    const slots = bookingTimes
      .map((time) => {
        const [hour, minute] = time.value.split(":").map(Number);
        const startAt = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            hour - 1,
            minute,
          ),
        );
        return { ...time, startAt };
      })
      .filter(({ startAt }) => startAt > now);

    dates.push({ date: dateValue, slots });
  }

  return dates;
}

export function findBookingSlot(date, time, now = new Date()) {
  return getBookingDates(now, 8)
    .find((entry) => entry.date === date)
    ?.slots.find((slot) => slot.value === time);
}
