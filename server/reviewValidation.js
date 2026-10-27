const fields = {
  name: { label: "Name", max: 80 },
  role: { label: "Role or title", max: 100 },
  country: { label: "Country", max: 80 },
  service: { label: "Service or project", max: 100 },
  text: { label: "Review", max: 1200 },
};

export function validateReviewPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "Please submit a valid review." };
  }

  if (typeof payload.website === "string" && payload.website.trim()) {
    return { error: "Please submit a valid review." };
  }

  const review = {};
  for (const [field, { label, max }] of Object.entries(fields)) {
    if (typeof payload[field] !== "string") {
      return { error: `${label} is required.` };
    }

    const value = payload[field].trim();
    if (!value) return { error: `${label} is required.` };
    if (value.length > max) {
      return { error: `${label} must be ${max} characters or fewer.` };
    }
    review[field] = value;
  }

  const rating = Number(payload.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Rating must be a whole number from 1 to 5." };
  }

  return { review: { ...review, rating } };
}
