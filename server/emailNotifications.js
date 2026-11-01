function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatBookingDate(startAt, timeZone) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(startAt));
}

export async function sendBookingNotification(
  booking,
  {
    apiKey = process.env.RESEND_API_KEY,
    recipient = process.env.BOOKING_NOTIFICATION_EMAIL,
    sender = process.env.RESEND_FROM_EMAIL,
    fetchImpl = fetch,
  } = {},
) {
  if (!apiKey || !recipient || !sender) {
    return { sent: false, reason: "not_configured" };
  }

  const scheduledAt = formatBookingDate(booking.startAt, booking.timeZone);
  const subject = `New discovery call booking: ${booking.name}`;
  const text = [
    "A new discovery call has been booked.",
    "",
    `Name: ${booking.name}`,
    `Email: ${booking.email}`,
    `Topic: ${booking.topic}`,
    `When: ${scheduledAt} (${booking.timeZone})`,
    `Duration: ${booking.durationMinutes} minutes`,
    `Notes: ${booking.notes || "None provided"}`,
    `Booking ID: ${booking.id}`,
  ].join("\n");
  const html = `
    <h1>New discovery call booking</h1>
    <p><strong>Name:</strong> ${escapeHtml(booking.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(booking.email)}</p>
    <p><strong>Topic:</strong> ${escapeHtml(booking.topic)}</p>
    <p><strong>When:</strong> ${escapeHtml(scheduledAt)} (${escapeHtml(booking.timeZone)})</p>
    <p><strong>Duration:</strong> ${escapeHtml(booking.durationMinutes)} minutes</p>
    <p><strong>Notes:</strong><br>${escapeHtml(booking.notes || "None provided").replaceAll("\n", "<br>")}</p>
    <p><strong>Booking ID:</strong> ${escapeHtml(booking.id)}</p>
  `;

  const response = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: booking.email,
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Resend rejected the booking notification (HTTP ${response.status}).`);
  }

  return { sent: true };
}
