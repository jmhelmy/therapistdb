// src/lib/auth.ts

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import crypto from "crypto";
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt", // 👈 Changed from "database" to "jwt"
  },

  pages: {
    signIn: "/register",
    error: "/register",
  },

  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("📧 authorize: Received credentials email:", credentials?.email);
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("👤 authorize: User found in database:", !!user);

        if (!user) {
          throw new Error("No user found with that email")
        }

        const isValid = await compare(credentials.password, user.password);

        console.log("🔑 authorize: Password comparison result:", isValid);

        if (!isValid) {
          throw new Error("Invalid password")
        }

        const { password, ...safeUser } = user
        return safeUser
      },
    }),
  ],

  callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id
        }
        return token
      },

    async signIn({ user, account, profile, email, credentials }) {
      if (!user?.id) return false

      try {
        console.log('🔐 signIn callback triggered for user:', user.email)

        const existing = await prisma.therapist.findUnique({
          where: { userId: user.id },
        })

        if (!existing) {
          console.log('🧠 No therapist found, creating new one for:', user.email)
          await prisma.therapist.create({
            data: {
              userId: user.id,
              name: user.email?.split('@')[0] || 'New Therapist',
              slug: `${user.email?.split('@')[0]?.toLowerCase() || 'therapist'}-${Math.random().toString(36).substring(2, 6)}`,
              published: false,
            },
          })
        }
        // The following code was intended to explicitly create a session in the database
        // for the "database" strategy. However, we are now using the "jwt" strategy,
        // and this code is causing an error. We are commenting it out for now.
        // if (account?.provider === 'credentials') { // Only do this for credentials provider
        //   const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Example: session expires in 30 days
        //   await prisma.session.create({
        //     data: {
        //       userId: user.id,
        //       expires: expires,
        //       sessionToken: crypto.randomUUID(), // Generate a unique session token
        //     },
        //   }); // remove the extra closing brace
      } catch (err) {
        console.error('❌ Error in signIn callback:', err)
        return false
      }

      return true
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          id: token.id as string,
          email: session.user?.email!,
        }
      }
      return session
    },
  },
}
