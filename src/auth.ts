import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false

      const allowedUser = await prisma.allowedUser.findUnique({
        where: { email: user.email },
      })
      if (allowedUser) return true

      const envEntries = (process.env.ALLOWED_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
      const userEmail = user.email.toLowerCase()
      const allowedByEnv = envEntries.some((entry) => {
        if (entry.startsWith("@")) return userEmail.endsWith(entry)
        return userEmail === entry
      })
      if (allowedByEnv) return true

      return "/login?error=AccessDenied"
    },
  },
})
