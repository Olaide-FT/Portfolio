import { useEffect, useMemo, useState } from "react";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const whatsappNumber = "2349159885788";

async function readResponse(response) {
  const body = await response.text();
  let result = {};

  if (body) {
    try {
      result = JSON.parse(body);
    } catch {
      if (response.ok) throw new Error("The booking service returned an invalid response.");
    }
  }

  if (!response.ok) {
    throw new Error(result.error || "Could not connect to the booking service. Please try again.");
  }

  return result;
}

function formatBookingDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00Z`));
}

function BookingProgress({ step }) {
  return (
    <div className="mb-7 flex items-center gap-3" aria-label={`Step ${step} of 2`}>
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${step === 1 ? "bg-accent text-white shadow-lg shadow-accent/25" : "bg-emerald-500 text-white"}`}>
        {step === 1 ? "1" : <i className="fa-solid fa-check" aria-hidden="true" />}
      </span>
      <span className={`h-px flex-1 ${step === 2 ? "bg-accent" : "bg-slate-200 dark:bg-slate-700"}`} />
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${step === 2 ? "bg-accent text-white shadow-lg shadow-accent/25" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
        2
      </span>
    </div>
  );
}

function DiscoveryBooking() {
  const [dates, setDates] = useState([]);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const selectedDay = useMemo(
    () => dates.find(({ date }) => date === selectedDate),
    [dates, selectedDate],
  );
  const selectedSlot = selectedDay?.slots.find(({ value }) => value === selectedTime);

  const loadAvailability = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings/availability`);
      const result = await readResponse(response);
      setDates(result.dates);
      setDurationMinutes(result.durationMinutes);
      const currentDay = result.dates.find(({ date }) => date === selectedDate);
      const preferredDay = currentDay?.slots.length
        ? currentDay
        : result.dates.find(({ slots }) => slots.length);
      setSelectedDate(preferredDay?.date || "");
      setSelectedTime((currentTime) => {
        if (preferredDay?.date === selectedDate && preferredDay.slots.some(({ value }) => value === currentTime)) {
          return currentTime;
        }
        return preferredDay?.slots[0]?.value || "";
      });
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    setSubmitError("");
  };

  const handleContinue = () => {
    if (!selectedDay?.slots.length) {
      setSubmitError("Please choose an available date.");
      return;
    }
    if (!selectedTime || !selectedDay.slots.some(({ value }) => value === selectedTime)) {
      setSubmitError("Please choose an available time.");
      return;
    }

    setSubmitError("");
    setStep(2);
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      topic: formData.get("topic"),
      notes: formData.get("notes"),
      website: formData.get("website"),
      date: selectedDate,
      time: selectedTime,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await readResponse(response);
      setConfirmedBooking(result.booking);
      setStep(3);
    } catch (error) {
      setSubmitError(error.message);
      if (error.message.includes("just booked") || error.message.includes("no longer available")) {
        setStep(1);
        await loadAvailability();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappText = selectedSlot
    ? `Hi Fareedah, I would like to book a ${durationMinutes}-minute discovery call for ${formatBookingDate(selectedDate)} at ${selectedSlot.label} WAT.`
    : "Hi Fareedah, I would like to ask about booking a discovery call.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <section
      className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12"
      id="booking"
      aria-labelledby="booking-heading"
    >
      <div className="mb-7 text-center sm:mb-9" data-reveal>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
          Discovery session
        </p>
        <h2 className="reveal-text font-display text-3xl font-semibold tracking-[-0.06em] sm:text-4xl" id="booking-heading">
          Schedule a Discovery Call
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
          Book a {durationMinutes}-minute session to talk through your project, scope, or technical questions.
        </p>
      </div>

      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8" data-reveal>
        {step === 3 && confirmedBooking ? (
          <div className="py-7 text-center" role="status" aria-live="polite">
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-2xl text-emerald-600 dark:text-emerald-400">
              <i className="fa-solid fa-check" aria-hidden="true" />
            </span>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Booking confirmed</p>
            <h3 className="font-display text-2xl font-bold">You&apos;re on the calendar, {confirmedBooking.name}.</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
              Your {confirmedBooking.durationMinutes}-minute discovery call is booked for{" "}
              <strong className="text-slate-900 dark:text-white">
                {formatBookingDate(selectedDate)} at {selectedSlot?.label} WAT
              </strong>
              . A confirmation has been saved for {confirmedBooking.email}.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Please contact me directly if you need to change your booking.
            </p>
          </div>
        ) : (
          <>
            <BookingProgress step={step} />

            {loadError ? (
              <div className="rounded-2xl border border-red-300 bg-red-50 p-5 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" role="alert">
                <p>{loadError}</p>
                <button className="mt-3 font-semibold underline underline-offset-4" type="button" onClick={loadAvailability}>
                  Try again
                </button>
              </div>
            ) : loading ? (
              <p className="py-8 text-center text-sm text-slate-500" role="status">Loading available times…</p>
            ) : step === 1 ? (
              <>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  1. Select an available date
                </h3>
                {dates.some(({ slots }) => slots.length > 0) ? (
                  <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Available dates">
                    {dates.map(({ date, slots }) => (
                      <button
                        className={`min-w-[96px] rounded-xl border px-3 py-3 text-xs font-semibold transition ${selectedDate === date ? "border-accent bg-accent text-white shadow-md shadow-accent/20" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-accent dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"} ${slots.length === 0 ? "cursor-not-allowed opacity-45" : ""}`}
                        key={date}
                        type="button"
                        disabled={!slots.length}
                        onClick={() => handleDateSelect(date)}
                        aria-pressed={selectedDate === date}
                      >
                        {formatBookingDate(date)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    No call times are available in the next few days. Please contact me to arrange a time.
                  </p>
                )}

                <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  2. Select a time (West Africa Time)
                </h3>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Available times">
                  {selectedDay?.slots.map(({ value, label }) => (
                    <button
                      className={`min-w-[104px] rounded-xl border px-4 py-3 text-xs font-semibold transition ${selectedTime === value ? "border-accent bg-accent text-white shadow-md shadow-accent/20" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-accent dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"}`}
                      key={value}
                      type="button"
                      onClick={() => {
                        setSelectedTime(value);
                        setSubmitError("");
                      }}
                      aria-pressed={selectedTime === value}
                    >
                      {label}
                    </button>
                  ))}
                  {selectedDay && selectedDay.slots.length === 0 && (
                    <p className="text-sm text-slate-500">No times remain for this date. Please select another day.</p>
                  )}
                  {!selectedDay && dates.some(({ slots }) => slots.length > 0) && (
                    <p className="text-sm text-slate-500">Choose a date to see its available times.</p>
                  )}
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald-600/50 px-4 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-brands fa-whatsapp" aria-hidden="true" />
                    Quick book via WhatsApp
                  </a>
                  <button
                    className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-accent px-5 text-xs font-semibold text-white transition hover:bg-[#e84c3c] disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={handleContinue}
                    disabled={!selectedSlot}
                  >
                    Continue to confirmation <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </button>
                </div>
              </>
            ) : (
              <form className="space-y-4" onSubmit={handleBookingSubmit}>
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-accent">Selected session</p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatBookingDate(selectedDate)} · {selectedSlot?.label} WAT · {durationMinutes} minutes
                  </p>
                  <button className="mt-2 text-xs font-semibold text-slate-600 underline underline-offset-4 hover:text-accent dark:text-slate-300" type="button" onClick={() => setStep(1)}>
                    Change date or time
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="sr-only" htmlFor="booking-name">Your name</label>
                  <input
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-accent dark:border-slate-700 dark:bg-slate-950"
                    id="booking-name"
                    name="name"
                    autoComplete="name"
                    maxLength={80}
                    placeholder="Your name *"
                    required
                  />
                  <label className="sr-only" htmlFor="booking-email">Your email</label>
                  <input
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-accent dark:border-slate-700 dark:bg-slate-950"
                    id="booking-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    placeholder="Your email *"
                    required
                  />
                </div>
                <label className="sr-only" htmlFor="booking-topic">What would you like to discuss?</label>
                <input
                  className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-accent dark:border-slate-700 dark:bg-slate-950"
                  id="booking-topic"
                  name="topic"
                  maxLength={120}
                  placeholder="What would you like to discuss? *"
                  required
                />
                <label className="sr-only" htmlFor="booking-notes">Additional details</label>
                <textarea
                  className="min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-accent dark:border-slate-700 dark:bg-slate-950"
                  id="booking-notes"
                  name="notes"
                  maxLength={1000}
                  placeholder="Anything else I should know? (optional)"
                />
                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="booking-website">Leave this field empty</label>
                  <input id="booking-website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {submitError && (
                  <p className="text-sm text-red-600 dark:text-red-400" role="alert">{submitError}</p>
                )}
                <button
                  className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-[#e84c3c] disabled:cursor-wait disabled:opacity-60"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Confirming your call…" : "Confirm discovery call"}
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </button>
                <p className="text-center text-xs text-slate-500">
                  Your selected time is confirmed as soon as the booking is saved.
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default DiscoveryBooking;
