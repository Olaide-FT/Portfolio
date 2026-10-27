import mongoose from "mongoose";
import { bookingDurationMinutes } from "../bookingSchedule.js";

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    topic: { type: String, required: true, trim: true, maxlength: 120 },
    notes: { type: String, trim: true, maxlength: 1000, default: "" },
    startAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, default: bookingDurationMinutes },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
      index: true,
    },
  },
  { timestamps: true },
);

bookingSchema.index(
  { startAt: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "confirmed" },
  },
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
