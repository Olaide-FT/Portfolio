import { useEffect, useState } from "react";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function readApiResponse(response) {
  const body = await response.text();
  let result = {};

  if (body) {
    try {
      result = JSON.parse(body);
    } catch {
      if (response.ok) {
        throw new Error("The reviews service returned an invalid response.");
      }
    }
  }

  if (!response.ok) {
    throw new Error(result.error || "Could not connect to the reviews service. Please try again later.");
  }

  return result;
}

async function requestReviews(limit = 3) {
  const response = await fetch(`${apiBaseUrl}/api/reviews?limit=${limit}`);
  return readApiResponse(response);
}

function ReviewCard({ review }) {
  const reviewDate = new Date(review.approvedAt || review.createdAt);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-sm font-bold">{review.name}</h3>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {review.role} · {review.country}
          </p>
        </div>
        <span className="shrink-0 text-xs tracking-[0.12em] text-accent" aria-label={`${review.rating} out of 5 stars`}>
          {"★".repeat(review.rating)}
          <span className="text-slate-300 dark:text-slate-600">{"★".repeat(5 - review.rating)}</span>
        </span>
      </div>
      <blockquote className="flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
        “{review.text}”
      </blockquote>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-[10px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
        <span className="truncate">✓ {review.service}</span>
        <time dateTime={reviewDate.toISOString()}>
          {reviewDate.toLocaleDateString(undefined, { month: "short", year: "numeric" })}
        </time>
      </div>
    </article>
  );
}

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [submitError, setSubmitError] = useState("");

  const loadReviews = async (limit = 3) => {
    setLoading(true);
    setLoadError("");
    try {
      const result = await requestReviews(limit);
      setReviews(result.reviews);
      setTotal(result.total);
      setAverageRating(result.averageRating);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleShowAll = async () => {
    setShowAll(true);
    await loadReviews(100);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitStatus("");
    setSubmitError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const review = Object.fromEntries(formData.entries());
    review.rating = rating;

    try {
      const response = await fetch(`${apiBaseUrl}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      const result = await readApiResponse(response);

      form.reset();
      setRating(5);
      setSubmitStatus(result.message);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12"
      id="testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className="mb-7 text-center sm:mb-9" data-reveal>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
          Client testimonials
        </p>
        <h2
          id="testimonials-heading"
          className="reveal-text font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl"
        >
          Client Endorsements
        </h2>
        {total > 0 ? (
          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span className="mr-2 tracking-[0.12em] text-accent" aria-hidden="true">★★★★★</span>
            {averageRating.toFixed(1)} / 5.0 Rating ({total} {total === 1 ? "review" : "reviews"})
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {loading ? "Loading client reviews…" : "Be the first to share your experience."}
          </p>
        )}
      </div>

      {loadError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-5 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" role="alert">
          <p>{loadError}</p>
          <button
            className="mt-3 font-semibold underline underline-offset-4"
            type="button"
            onClick={() => loadReviews(showAll ? 100 : 3)}
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {loading && reviews.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              Loading client reviews…
            </p>
          ) : reviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
              {reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              There are no approved client reviews yet.
            </p>
          )}

          {!showAll && total > reviews.length && (
            <div className="mt-8 text-center">
              <button
                className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-slate-300 px-5 text-xs font-semibold transition hover:border-accent hover:text-accent dark:border-slate-700"
                type="button"
                onClick={handleShowAll}
                disabled={loading}
              >
                View all client endorsements ({total})
                <i className="fa-solid fa-arrow-down" aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}

      <form
        className="mx-auto mt-10 max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7"
        onSubmit={handleSubmit}
        data-reveal
      >
        <h3 className="font-display text-xl font-bold tracking-tight">Leave a Client Review</h3>
        <p className="mb-5 mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Have we partnered on a project? Share your feedback. Reviews are published after approval.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="sr-only" htmlFor="review-name">Your name</label>
          <input
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition placeholder:text-slate-500 focus:border-accent dark:border-slate-700 dark:bg-slate-950"
            id="review-name"
            name="name"
            placeholder="Your name *"
            autoComplete="name"
            maxLength={80}
            required
          />
          <label className="sr-only" htmlFor="review-role">Role or title</label>
          <input
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition placeholder:text-slate-500 focus:border-accent dark:border-slate-700 dark:bg-slate-950"
            id="review-role"
            name="role"
            placeholder="Role / Title *"
            maxLength={100}
            required
          />
          <label className="sr-only" htmlFor="review-country">Country</label>
          <input
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition placeholder:text-slate-500 focus:border-accent dark:border-slate-700 dark:bg-slate-950"
            id="review-country"
            name="country"
            placeholder="Country (e.g. Nigeria, UK) *"
            autoComplete="country-name"
            maxLength={80}
            required
          />
          <label className="sr-only" htmlFor="review-service">Service or project delivered</label>
          <input
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition placeholder:text-slate-500 focus:border-accent dark:border-slate-700 dark:bg-slate-950"
            id="review-service"
            name="service"
            placeholder="Service / Project Delivered *"
            maxLength={100}
            required
          />
        </div>

        <fieldset className="mt-4">
          <legend className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">Your rating</legend>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;
              return (
                <button
                  className={`p-1 text-2xl transition hover:scale-110 ${value <= rating ? "text-accent" : "text-slate-300 dark:text-slate-600"}`}
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  aria-pressed={rating === value}
                >
                  ★
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="sr-only" htmlFor="review-text">Share your experience</label>
        <textarea
          className="mt-3 min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none transition placeholder:text-slate-500 focus:border-accent dark:border-slate-700 dark:bg-slate-950"
          id="review-text"
          name="text"
          placeholder="Share your experience working with me…"
          maxLength={1200}
          required
        />

        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="review-website">Leave this field empty</label>
          <input id="review-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <button
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-5 text-xs font-semibold text-white transition hover:bg-[#e84c3c] disabled:cursor-wait disabled:opacity-60"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit Public Review"}
          <span aria-hidden="true">★</span>
        </button>
        <p className="mt-3 min-h-5 text-center text-xs text-emerald-700 dark:text-emerald-400" role="status" aria-live="polite">
          {submitStatus}
        </p>
        {submitError && (
          <p className="mt-2 text-center text-xs text-red-600 dark:text-red-400" role="alert">
            {submitError}
          </p>
        )}
      </form>
    </section>
  );
}

export default Testimonials;
