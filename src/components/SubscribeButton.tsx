"use client";
import { loadStripe } from "@stripe/stripe-js";

export function SubscribeButton({ email }: { email: string }) {
  const handleClick = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const { url } = await res.json();
    window.location.assign(url);
  };

  return (
    <button onClick={handleClick} className="btn">
      Start $10/mo Subscription
    </button>
  );
}
