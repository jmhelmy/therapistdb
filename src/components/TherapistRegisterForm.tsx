"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TherapistRegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess(true);
      // Redirect to profile creation page after successful registration
      router.push("/admin/therapists/new");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FAFBFA] px-4">
      <h1 className="text-2xl font-bold mb-6">Claim profile</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div>
          <label className="block text-lg font-semibold mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#f1f5f9] rounded-md"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-1">Create Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#f1f5f9] rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-full w-full"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Registration successful!</p>}
      </form>
    </div>
  );
}
