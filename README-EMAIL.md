# Automatic access email (Resend)

When EasySlip passes and the order is changed to `PAID`, the server sends one access email through Resend.

Required `.env.local` values for local testing:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM=Passive Income <onboarding@resend.dev>
RESEND_TEST_TO=the-email-used-with-your-resend-account@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`RESEND_TEST_TO` is a testing override. Customer email is still stored on the order, but the email is routed to the test address while you are using the Resend test domain. Remove `RESEND_TEST_TO` after you verify your own sending domain.

The email includes only the customer's protected `/access/[token]` URL. It does not expose the underlying Facebook, LINE, Google Drive, or other resource links in the email itself.

Email delivery is non-blocking: a Resend error will not undo a successful payment or prevent the customer from receiving access on the website.
