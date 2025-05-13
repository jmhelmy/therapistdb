import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripeSecret = process.env.STRIPE_SECRET_KEY
const priceId = process.env.STRIPE_PRICE_ID

if (!stripeSecret || !priceId) {
  throw new Error('Missing Stripe environment variables')
}

const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' })

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/for-therapists`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
