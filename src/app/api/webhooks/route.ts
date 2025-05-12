// src/app/api/webhooks/route.ts
import { buffer } from "micro";
import Stripe from "stripe";
import { NextResponse } from "next/server";

export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });

export async function POST(req: Request) {
  const buf = await buffer(req);
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  // handle event.type...
  return NextResponse.json({ received: true });
}
