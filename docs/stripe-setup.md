# Stripe Setup

1. Create Product: Darkstar Audit AI Pro
2. Add recurring price: $29/month
3. Copy Price ID to STRIPE_PRO_PRICE_ID
4. Add webhook endpoint: https://YOUR_DOMAIN/api/stripe/webhook
5. Listen for:
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_failed
6. Copy webhook secret to STRIPE_WEBHOOK_SECRET
