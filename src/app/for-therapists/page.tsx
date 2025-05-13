// src/app/api/webhooks/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // we want the raw body
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function POST(req: Request) {
  // 1. Read raw body as text
  const payload = await req.text();

  // 2. Grab signature header
  const signature = req.headers.get("stripe-signature")!;
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // 3. Construct the event
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 4. Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // TODO: mark subscription active in your DB
      break;
    case "customer.subscription.deleted":
      // TODO: mark subscription canceled in your DB
      break;
    // ... handle other event types as needed
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  // 5. Return a 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}
