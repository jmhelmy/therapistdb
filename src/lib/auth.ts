// src/lib/auth.ts

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt", // 👈 this must be database for PrismaAdapter
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
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error("No user found with that email")
        }

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Invalid password")
        }

        const { password, ...safeUser } = user
        return safeUser
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
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
      } catch (err) {
        console.error('❌ Error in signIn callback:', err)
        return false
      }

      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
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
