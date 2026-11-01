import assert from "node:assert/strict";
import test from "node:test";
import { sendBookingNotification } from "./emailNotifications.js";

const booking = {
  id: "booking-123",
  name: "Alex Client",
  email: "alex@example.com",
  topic: "Portfolio website",
  notes: "<script>alert('x')</script>\nNeed a new site",
  startAt: "2026-11-03T08:00:00.000Z",
  durationMinutes: 60,
  timeZone: "Africa/Lagos",
};

test("sends a booking notification through the Resend API", async () => {
  let request;
  const result = await sendBookingNotification(booking, {
    apiKey: "test-key",
    recipient: "owner@example.com",
    sender: "Portfolio <bookings@example.com>",
    fetchImpl: async (url, options) => {
      request = { url, options };
      return { ok: true, status: 200 };
    },
  });

  const body = JSON.parse(request.options.body);
  assert.equal(result.sent, true);
  assert.equal(request.url, "https://api.resend.com/emails");
  assert.equal(request.options.headers.Authorization, "Bearer test-key");
  assert.deepEqual(body.to, ["owner@example.com"]);
  assert.equal(body.reply_to, booking.email);
  assert.match(body.text, /Alex Client/);
  assert.match(body.text, /Tuesday, 3 November 2026 at 09:00/);
  assert.match(body.html, /&lt;script&gt;/);
  assert.doesNotMatch(body.html, /<script>/);
});

test("reports missing Resend configuration without attempting delivery", async () => {
  const result = await sendBookingNotification(booking, {
    apiKey: "",
    recipient: "owner@example.com",
    sender: "Portfolio <bookings@example.com>",
    fetchImpl: () => assert.fail("Fetch should not run without email configuration"),
  });

  assert.deepEqual(result, { sent: false, reason: "not_configured" });
});

test("surfaces Resend delivery failures", async () => {
  await assert.rejects(
    sendBookingNotification(booking, {
      apiKey: "test-key",
      recipient: "owner@example.com",
      sender: "Portfolio <bookings@example.com>",
      fetchImpl: async () => ({ ok: false, status: 422 }),
    }),
    /Resend rejected the booking notification \(HTTP 422\)/,
  );
});
