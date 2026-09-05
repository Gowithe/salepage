# EasySlip connection — V1

This version connects the Payment page to EasySlip API v2 on the server.

## Before testing

1. Keep `EASYSLIP_API_KEY=...` in `.env.local` at the project root.
2. In EasySlip, register/link the bank account that receives customer payments. The API request uses `matchAccount=true`.
3. Restart the Next.js dev server after changing `.env.local`.

## What is checked

- Slip image is JPG/PNG/GIF/WebP and <= 4 MB.
- EasySlip bank-slip verification succeeds.
- Receiver matches an account registered in EasySlip (`matchAccount=true`).
- Amount is exactly 390 THB (`matchAmount=390`).
- Duplicate-slip checking is enabled (`checkDuplicate=true`).

## Current limitation

Orders are still temporary/mocked. A successful EasySlip verification does NOT yet grant member access. The next step is Supabase so the server can save the order, payment transaction reference, Paid status, and a secure access token.
