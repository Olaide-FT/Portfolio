import assert from "node:assert/strict";
import test from "node:test";
import { getBookingDates, findBookingSlot } from "./bookingSchedule.js";
import { validateBookingPayload } from "./bookingValidation.js";

const now = new Date("2026-10-27T12:00:00.000Z");
const validPayload = {
  name: "Alex Client",
  email: "alex@example.com",
  topic: "Portfolio website",
  notes: "Discuss project scope",
  date: "2026-10-28",
  time: "09:00",
};

test("provides upcoming weekday slots in West Africa Time", () => {
  const dates = getBookingDates(now, 8);

  assert.equal(dates[0].date, "2026-10-27");
  assert.equal(dates[0].slots.length, 0);
  assert.equal(dates[1].date, "2026-10-28");
  assert.deepEqual(dates[1].slots.map(({ value }) => value), ["09:00", "10:30", "13:00"]);
  assert.equal(dates[1].slots[0].startAt.toISOString(), "2026-10-28T08:00:00.000Z");
  assert.equal(dates.some(({ date }) => ["2026-10-31", "2026-11-01"].includes(date)), false);
});

test("only returns a valid future slot within the visible booking window", () => {
  assert.equal(findBookingSlot("2026-10-28", "10:30", now).startAt.toISOString(), "2026-10-28T09:30:00.000Z");
  assert.equal(findBookingSlot("2026-10-27", "09:00", now), undefined);
  assert.equal(findBookingSlot("2026-10-31", "09:00", now), undefined);
});

test("accepts valid details and rejects invalid booking payloads", () => {
  const result = validateBookingPayload(validPayload);

  assert.equal(result.error, undefined);
  assert.equal(result.booking.email, "alex@example.com");
  assert.match(validateBookingPayload({ ...validPayload, email: "not-an-email" }).error, /valid email/);
  assert.match(validateBookingPayload({ ...validPayload, website: "spam" }).error, /valid booking/);
  assert.match(validateBookingPayload({ ...validPayload, notes: "x".repeat(1001) }).error, /1000 characters/);
});
