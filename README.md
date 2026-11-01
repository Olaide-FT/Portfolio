# Fareedah Olaide Portfolio

## Run the portfolio and reviews API locally

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to a MongoDB connection string and replace `REVIEW_ADMIN_KEY` with a random secret of at least 32 characters.
3. Set `CLIENT_ORIGIN` to the frontend origin. Separate multiple origins with commas.
4. Run `npm run dev`. This starts both the API and Vite frontend; keep the terminal open while developing.

The Vite development server proxies `/api` requests to `http://localhost:4000`. If the API fails to start, `npm run dev` reports the error and stops the frontend instead of leaving proxy requests to fail.

## Review behavior

Public reviews are stored as `pending` and never appear on the portfolio until approved. Only approved reviews are returned by `GET /api/reviews`. The API validates submissions, limits submission frequency, and includes a honeypot field for basic bot filtering.

## Discovery call bookings

The booking calendar offers the next eight calendar days, Monday through Friday, with one-hour calls starting at 9:00 AM, 10:30 AM, and 1:00 PM West Africa Time (`Africa/Lagos`). Past times are hidden, and confirmed bookings are removed from availability. `GET /api/bookings/availability` returns the current open slots.

Bookings are confirmed immediately and stored in MongoDB. A unique database index prevents two visitors from reserving the same start time. `POST /api/bookings` validates the visitor details and selected slot. To view confirmed bookings, use `GET /api/admin/bookings` with the `x-admin-key` header. Cancel a booking with `PATCH /api/admin/bookings/:id` and `{"status":"cancelled"}`; its slot becomes available again.

To email the site owner when a booking is made, configure these API environment variables in `.env` (or your hosting provider):

- `RESEND_API_KEY`: API key from Resend.
- `BOOKING_NOTIFICATION_EMAIL`: inbox that should receive booking notifications.
- `RESEND_FROM_EMAIL`: sender address verified in Resend, such as `Portfolio <bookings@example.com>`.

Resend requires a verified sending domain for production delivery. Restart the API after changing these values. If email delivery is unavailable, the booking remains saved; the API logs the notification failure and the booking form tells the visitor to contact the site owner.

Use the secret `REVIEW_ADMIN_KEY` in the `x-admin-key` header to moderate reviews:

- `GET /api/admin/reviews` lists pending reviews.
- `PATCH /api/admin/reviews/:id` with `{"status":"approved"}` or `{"status":"rejected"}` updates a review.

To moderate reviews in the portfolio, choose **Admin** in the navigation bar to open the moderation dialog, then enter the `REVIEW_ADMIN_KEY` configured in the API's `.env` file. Close the dialog or sign out to clear the key from page memory. Use HTTPS when moderating a deployed site.

Do not expose the admin key in frontend code or commit `.env`. For command-line moderation with PowerShell:

```powershell
$headers = @{ "x-admin-key" = "YOUR_REVIEW_ADMIN_KEY" }
Invoke-RestMethod -Uri "http://localhost:4000/api/admin/reviews" -Headers $headers
Invoke-RestMethod -Method Patch -Uri "http://localhost:4000/api/admin/reviews/REVIEW_ID" -Headers $headers -ContentType "application/json" -Body '{"status":"approved"}'
```

## Deployment

Deploy the Vite frontend and Express API as separate services. On the API host, configure `MONGODB_URI`, `REVIEW_ADMIN_KEY` (at least 32 characters), and `CLIENT_ORIGIN` (the exact frontend origin, including `https://` but no path). The current Vercel production origin is also allowed by default; set `CLIENT_ORIGIN` for any additional custom or preview domains. The API listens on the host-provided `PORT` and exposes `/api/health` for health checks.

The repository's `vercel.json` forwards production `/api/*` requests to the Render API, keeping browser requests same-origin and avoiding cross-origin browser restrictions. Leave `VITE_API_URL` unset on Vercel so these rewrites are used. If deploying the frontend elsewhere, configure an equivalent `/api/*` reverse proxy or set `VITE_API_URL` to the public API origin and allow that frontend origin in the API's CORS configuration. The Vite proxy to `localhost:4000` is development-only.

Use `.env.example` as the local environment-variable checklist. Do not copy its blank database or admin-key values to production; set production secrets in the hosting provider's environment configuration.

Run `npm run test:server` for backend validation and schedule tests and `npm run build` for the frontend production build.
