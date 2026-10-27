const fields = {
  name: { label: "Name", max: 80 },
  email: { label: "Email", max: 254 },
  topic: { label: "Call topic", max: 120 },
  notes: { label: "Notes", max: 1000, optional: true },
  date: { label: "Date", max: 10 },
  time: { label: "Time", max: 5 },
};

export function validateBookingPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "Please submit valid booking details." };
  }

  if (typeof payload.website === "string" && payload.website.trim()) {
    return { error: "Please submit valid booking details." };
  }

  const booking = {};
  for (const [field, { label, max, optional }] of Object.entries(fields)) {
    const rawValue = payload[field];
    if (optional && (rawValue === undefined || rawValue === "")) {
      booking[field] = "";
      continue;
    }
    if (typeof rawValue !== "string") {
      return { error: `${label} is required.` };
    }

    const value = rawValue.trim();
    if (!value && optional) {
      booking[field] = "";
      continue;
    }
    if (!value) return { error: `${label} is required.` };
    if (value.length > max) {
      return { error: `${label} must be ${max} characters or fewer.` };
    }
    booking[field] = value;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(booking.date)) {
    return { error: "Please select a valid date." };
  }
  if (!/^\d{2}:\d{2}$/.test(booking.time)) {
    return { error: "Please select a valid time." };
  }

  return { booking };
}
