# Tutoring — Leicestershire

First Astro draft on `dev`. `main` is unchanged. Five main pages plus a draft privacy page; responsive sage/cream design, locally hosted study illustration, sample profiles and explicitly illustrative review copy. No invented rates, tutor credentials or contact details. SATs suitability is flagged because KS2 SATs generally falls below the supplied main 11–16 audience.

## Develop and build

Node 22 recommended. `npm ci`, `npm run dev`, `npm run build`. Output `dist`.

## Cloudflare Pages

Connect this repository, production branch `main`, enable preview builds for `dev`. Framework Astro, build command `npm run build`, output `dist`, root repository root. Cloudflare deploys the root `functions` directory with the static build. A static-only Worker deployment does not run the Pages enquiry function.

## Enable real enquiry email

No email recipient was supplied, so the draft form remains disabled by default. Use a Resend account with a verified sender domain and Cloudflare Turnstile widget configured for your preview and final hostname. In Pages Preview settings set:

- `PUBLIC_TURNSTILE_SITE_KEY` (public build variable)
- `TURNSTILE_SECRET_KEY` (secret)
- `RESEND_API_KEY` (secret)
- `ENQUIRY_FROM_EMAIL` (verified sender, e.g. `Tutoring <enquiries@YOUR_DOMAIN>`)
- `ENQUIRY_TO_EMAIL` (actual service recipient)

Redeploy after changes. Form posts to `/api/enquiry`; server validates input, same origin and Turnstile hostname, then sends a plain text email with parent/carer reply-to. No website database storage. No attachments or sensitive child details requested. Test delivery and reply-to with a genuine enquiry before launch; provider failure must show failure instead of success. Tokens are single-use; security widget resets after submission.

## Before launch

Supply actual business name/contact, subjects and hourly rates, session location/format/frequency, verified tutor profiles and safeguarding information. Replace sample feedback with permissioned real reviews or remove the samples. Finalise the privacy notice (business identity, lawful basis, retention, processors and rights contact). Remove draft labels and noindex only after approval. Set Production email/Turnstile variables separately; preview settings do not apply to Production. No live email delivery or browser QA has been claimed from the build test.
