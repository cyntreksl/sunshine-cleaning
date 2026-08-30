# Sunshine Cleaning

Next.js website for Sunshine Cleaning in York.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). 
Live [sunshinecleaning.uk](sunshinecleaning.uk). 

## Enquiry email with Resend

The contact form posts to the Next.js Route Handler at `app/api/enquiry/route.ts`. It validates the submission, sends a branded enquiry notification to Sunshine Cleaning through Resend, and then sends a separate branded confirmation to the customer.

Copy `.env.example` to `.env.local` and configure:

```dotenv
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=website@sunshinecleaning.uk
RESEND_TO_EMAIL=info@sunshinecleaning.uk
SUNSHINE_FORM_TEST_MODE=0
```

Before production deployment:

1. Add and verify `sunshinecleaning.uk` (or the exact sending subdomain) in Resend.
2. Create a sending API key and set `RESEND_API_KEY` on the deployment platform.
3. Make sure `RESEND_FROM_EMAIL` uses the verified domain or subdomain.
4. Keep `SUNSHINE_FORM_TEST_MODE=0` in production.

`SUNSHINE_FORM_TEST_MODE=1` bypasses both external email deliveries and is only for automated tests. The Sunshine notification is the success-critical message; if it is accepted but the customer confirmation fails, the enquiry still returns success and the confirmation failure is logged for follow-up.

## Build and deploy

```bash
npm run build
npm run start
```

The project requires a Node.js-capable Next.js deployment. It is no longer a static export and does not use PHP. Configure the Resend values as server-side environment variables in Vercel or your Node hosting provider.
