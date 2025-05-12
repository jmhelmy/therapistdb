// src/app/api/create-portal-session/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });

export async function POST(req: Request) {
  const { customerId } = await req.json();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${req.headers.get("origin")}/dashboard`,
  });
  return NextResponse.redirect(session.url);
}
