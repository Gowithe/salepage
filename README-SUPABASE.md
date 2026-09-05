# Supabase live-order step

This version changes the mock checkout into a real Supabase-backed flow.

Flow:
1. Checkout creates/updates customer and creates PENDING order.
2. Payment page verifies slip with EasySlip.
3. Successful verification inserts payment, changes order to PAID, creates access token.
4. Browser redirects to /access/[token].
5. Access page checks PAID order before rendering member resources.

Required .env.local:
- EASYSLIP_API_KEY
- SUPABASE_URL
- SUPABASE_SECRET_KEY (recommended) OR SUPABASE_SERVICE_ROLE_KEY (legacy)

After changing .env.local, restart npm run dev.

Before production, add member resource URLs to .env.local.
