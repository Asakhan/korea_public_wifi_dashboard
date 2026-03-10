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
      
      if (!allowedUser) {
        return "/login?error=AccessDenied"
      }
      return true
    },
  },
})
