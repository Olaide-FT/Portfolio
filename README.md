# Fareedah Olaide Portfolio

## Run the portfolio and reviews API locally

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to a MongoDB connection string and replace `REVIEW_ADMIN_KEY` with a random secret of at least 32 characters.
3. Set `CLIENT_ORIGIN` to the frontend origin. Separate multiple origins with commas.
4. In one terminal, run `npm run server`.
5. In another terminal, run `npm run dev`.

The Vite development server proxies `/api` requests to `http://localhost:4000`.

## Review behavior

Public reviews are stored as `pending` and never appear on the portfolio until approved. Only approved reviews are returned by `GET /api/reviews`. The API validates submissions, limits submission frequency, and includes a honeypot field for basic bot filtering.

## Discovery call bookings

The booking calendar offers the next eight calendar days, Monday through Friday, with one-hour calls starting at 9:00 AM, 10:30 AM, and 1:00 PM West Africa Time (`Africa/Lagos`). Past times are hidden, and confirmed bookings are removed from availability. `GET /api/bookings/availability` returns the current open slots.

Bookings are confirmed immediately and stored in MongoDB. A unique database index prevents two visitors from reserving the same start time. `POST /api/bookings` validates the visitor details and selected slot. To view confirmed bookings, use `GET /api/admin/bookings` with the `x-admin-key` header. Cancel a booking with `PATCH /api/admin/bookings/:id` and `{"status":"cancelled"}`; its slot becomes available again. Confirmation is shown in the browser; email/calendar invitations are not configured.

Use the secret `REVIEW_ADMIN_KEY` in the `x-admin-key` header to moderate reviews:

- `GET /api/admin/reviews` lists pending reviews.
- `PATCH /api/admin/reviews/:id` with `{"status":"approved"}` or `{"status":"rejected"}` updates a review.

Do not expose the admin key in frontend code or commit `.env`. For example, with PowerShell:

```powershell
$headers = @{ "x-admin-key" = "YOUR_REVIEW_ADMIN_KEY" }
Invoke-RestMethod -Uri "http://localhost:4000/api/admin/reviews" -Headers $headers
Invoke-RestMethod -Method Patch -Uri "http://localhost:4000/api/admin/reviews/REVIEW_ID" -Headers $headers -ContentType "application/json" -Body '{"status":"approved"}'
```

## Deployment

Deploy the Vite frontend and Express API as separate services, configure `MONGODB_URI` and `REVIEW_ADMIN_KEY` on the API host, and set `CLIENT_ORIGIN` to the deployed frontend origin. Set `VITE_API_URL` to the public API origin when building the frontend. The default empty value uses same-origin `/api` paths for local Vite proxying or a same-origin production proxy.

Run `npm run test:server` for backend validation and schedule tests and `npm run build` for the frontend production build.
