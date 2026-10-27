import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { timingSafeEqual } from "node:crypto";
import Booking from "./models/Booking.js";
import Review from "./models/Review.js";
import { getBookingDates, bookingDurationMinutes, bookingTimeZone, findBookingSlot } from "./bookingSchedule.js";
import { validateBookingPayload } from "./bookingValidation.js";
import { validateReviewPayload } from "./reviewValidation.js";

const app = express();
const port = Number(process.env.PORT) || 4000;
const adminKey = process.env.REVIEW_ADMIN_KEY;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("This origin is not allowed to access the reviews API."));
    },
  }),
);
app.use(express.json({ limit: "10kb" }));

const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many review submissions. Please try again later." },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many booking attempts. Please try again later." },
});

function requireAdminKey(request, response, next) {
  const providedKey = request.get("x-admin-key") || "";
  const providedBuffer = Buffer.from(providedKey);
  const expectedBuffer = Buffer.from(adminKey || "");

  if (
    !adminKey ||
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return response.status(401).json({ error: "Admin authorization is required." });
  }

  return next();
}

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/reviews", async (request, response) => {
  const requestedLimit = Number.parseInt(request.query.limit, 10);
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 100)
    : 3;
  const approved = { status: "approved" };

  const [reviews, total, ratingSummary] = await Promise.all([
    Review.find(approved)
      .select("name role country service text rating createdAt approvedAt")
      .sort({ approvedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean(),
    Review.countDocuments(approved),
    Review.aggregate([
      { $match: approved },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]),
  ]);

  response.json({
    reviews,
    total,
    averageRating: ratingSummary[0]?.averageRating ?? null,
  });
});

app.post("/api/reviews", submissionLimiter, async (request, response) => {
  const result = validateReviewPayload(request.body);
  if (result.error) return response.status(400).json({ error: result.error });

  await Review.create(result.review);
  return response.status(201).json({
    message: "Thanks! Your review has been submitted for approval.",
  });
});

app.get("/api/bookings/availability", async (_request, response) => {
  const dates = getBookingDates();
  const allSlots = dates.flatMap(({ slots }) => slots);
  const bookedStarts = await Booking.find({
    status: "confirmed",
    startAt: { $in: allSlots.map(({ startAt }) => startAt) },
  })
    .select("startAt")
    .lean();
  const bookedTimes = new Set(bookedStarts.map(({ startAt }) => new Date(startAt).toISOString()));

  return response.json({
    timeZone: bookingTimeZone,
    durationMinutes: bookingDurationMinutes,
    dates: dates.map(({ date, slots }) => ({
      date,
      slots: slots
        .filter(({ startAt }) => !bookedTimes.has(startAt.toISOString()))
        .map(({ value, label }) => ({ value, label })),
    })),
  });
});

app.post("/api/bookings", bookingLimiter, async (request, response) => {
  const result = validateBookingPayload(request.body);
  if (result.error) return response.status(400).json({ error: result.error });

  const slot = findBookingSlot(result.booking.date, result.booking.time);
  if (!slot) {
    return response.status(400).json({ error: "That date or time is no longer available. Please choose another slot." });
  }

  const slotIsTaken = await Booking.exists({ startAt: slot.startAt, status: "confirmed" });
  if (slotIsTaken) {
    return response.status(409).json({ error: "That time was just booked. Please choose another available slot." });
  }

  try {
    const booking = await Booking.create({
      name: result.booking.name,
      email: result.booking.email,
      topic: result.booking.topic,
      notes: result.booking.notes,
      startAt: slot.startAt,
      durationMinutes: bookingDurationMinutes,
      status: "confirmed",
    });

    return response.status(201).json({
      message: "Your discovery call is confirmed.",
      booking: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        topic: booking.topic,
        startAt: booking.startAt,
        durationMinutes: booking.durationMinutes,
        timeZone: bookingTimeZone,
        status: booking.status,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({ error: "That time was just booked. Please choose another available slot." });
    }
    throw error;
  }
});

app.get("/api/admin/bookings", adminLimiter, requireAdminKey, async (request, response) => {
  const status = request.query.status || "confirmed";
  if (!["confirmed", "cancelled"].includes(status)) {
    return response.status(400).json({ error: "Choose a valid booking status." });
  }

  const bookings = await Booking.find({ status })
    .sort({ startAt: 1 })
    .limit(100)
    .lean();
  return response.json({ bookings });
});

app.patch(
  "/api/admin/bookings/:id",
  adminLimiter,
  requireAdminKey,
  async (request, response) => {
    const { status } = request.body || {};
    if (status !== "cancelled") {
      return response.status(400).json({ error: "Bookings can only be cancelled through this endpoint." });
    }
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(400).json({ error: "Booking ID is invalid." });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: request.params.id, status: "confirmed" },
      { status: "cancelled" },
      { new: true, runValidators: true },
    ).lean();

    if (!booking) return response.status(404).json({ error: "Confirmed booking was not found." });
    return response.json({ booking });
  },
);

app.get("/api/admin/reviews", adminLimiter, requireAdminKey, async (request, response) => {
  const status = request.query.status || "pending";
  if (!["pending", "approved", "rejected"].includes(status)) {
    return response.status(400).json({ error: "Choose a valid review status." });
  }

  const reviews = await Review.find({ status })
    .sort({ createdAt: 1 })
    .limit(100)
    .lean();
  return response.json({ reviews });
});

app.patch(
  "/api/admin/reviews/:id",
  adminLimiter,
  requireAdminKey,
  async (request, response) => {
    const { status } = request.body || {};
    if (!["approved", "rejected"].includes(status)) {
      return response.status(400).json({ error: "Status must be approved or rejected." });
    }
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(400).json({ error: "Review ID is invalid." });
    }

    const review = await Review.findByIdAndUpdate(
      request.params.id,
      {
        status,
        approvedAt: status === "approved" ? new Date() : null,
      },
      { new: true, runValidators: true },
    ).lean();

    if (!review) return response.status(404).json({ error: "Review was not found." });
    return response.json({ review });
  },
);

app.use((_request, response) => {
  response.status(404).json({ error: "API route was not found." });
});

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return response.status(400).json({ error: "Request body must be valid JSON." });
  }
  if (error.type === "entity.too.large") {
    return response.status(413).json({ error: "Request body is too large." });
  }
  if (error.message.includes("origin is not allowed")) {
    return response.status(403).json({ error: error.message });
  }

  console.error("Reviews API error:", error);
  return response.status(500).json({ error: "Internal server error." });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set before starting the reviews API.");
  }
  if (!adminKey || adminKey.length < 32) {
    throw new Error("REVIEW_ADMIN_KEY must be set to a secret of at least 32 characters.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`Reviews API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start reviews API:", error.message);
  process.exitCode = 1;
});
