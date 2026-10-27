import assert from "node:assert/strict";
import test from "node:test";
import { validateReviewPayload } from "./reviewValidation.js";

const validPayload = {
  name: "Alex Client",
  role: "Product Manager",
  country: "Nigeria",
  service: "Portfolio website",
  text: "The project was delivered on time and works beautifully.",
  rating: 5,
};

test("accepts and trims a complete review", () => {
  const result = validateReviewPayload({
    ...validPayload,
    name: "  Alex Client  ",
  });

  assert.equal(result.error, undefined);
  assert.equal(result.review.name, "Alex Client");
  assert.equal(result.review.rating, 5);
});

test("rejects missing required fields and invalid ratings", () => {
  assert.match(validateReviewPayload({ ...validPayload, name: " " }).error, /Name is required/);
  assert.match(validateReviewPayload({ ...validPayload, rating: 6 }).error, /Rating must/);
});

test("rejects oversized content and honeypot submissions", () => {
  assert.match(validateReviewPayload({ ...validPayload, text: "x".repeat(1201) }).error, /1200 characters/);
  assert.match(validateReviewPayload({ ...validPayload, website: "spam" }).error, /valid review/);
});
