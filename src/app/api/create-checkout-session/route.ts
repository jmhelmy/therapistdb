// src/app/api/create-checkout-session/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });

export async function POST(req: Request) {
  const { email } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    customer_email: email,
    success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get("origin")}/for-therapists`,
  });
  return NextResponse.json({ url: session.url });
}
