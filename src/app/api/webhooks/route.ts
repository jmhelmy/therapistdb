// src/app/api/webhooks/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // disable built-in parser to get raw body
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function POST(req: Request) {
  // 1. Get raw payload as string
  const payload = await req.text();

  // 2. Grab Stripe signature header
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 3. Handle your events
  switch (event.type) {
    case "checkout.session.completed":
      // TODO: Mark subscription active
      break;
    case "customer.subscription.deleted":
      // TODO: Mark subscription canceled
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  // 4. Acknowledge receipt
  return NextResponse.json({ received: true });
}
