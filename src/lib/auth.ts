// src/lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  // Secret used to encrypt/sign your JWTs and session cookies
  secret: process.env.NEXTAUTH_SECRET,

  // Use Prisma adapter to persist users in your database
  adapter: PrismaAdapter(prisma),

  // Use JWT sessions
  session: {
    strategy: "jwt",
  },

  // Override the default sign-in and error pages
  pages: {
    signIn: "/register",
    error: "/register",
  },

  // Configure a simple email/password provider
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
        // Return the user object (without the password)
        // NextAuth will include this on the session token
        // and make it available via useSession()
        // (you add id & email below in callbacks)
        const { password, ...safeUser } = user
        return safeUser
      },
    }),
  ],

  callbacks: {
    // Persist the user ID to the token right after sign in
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // Make the ID available on the session object
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
