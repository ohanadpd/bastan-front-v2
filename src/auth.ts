import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import axios from "axios"
import { ApiResponse } from "./types/api"
import { User } from "next-auth"
import { RegisterAccountResponse } from "./types/accounts.types"

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        mobile_number: { label: "phone" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const mobileNumber = String((credentials)?.mobile_number ?? "")
          const password = String((credentials)?.password ?? "")

          if (!mobileNumber || !password) {
            throw new InvalidLoginError()
          }
          const { data } = await axios.post<ApiResponse<{ access: string, refresh: string }>>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/account/login-password/`,
            { mobile_number: mobileNumber, password }
          );

          const isValid = data.code === 200;

          if (!isValid) {
            throw new InvalidLoginError()
          }

          const accessToken = data.data.access;
          const refreshToken = data.data.refresh;

          return {
            phone: mobileNumber,
            accessToken: accessToken,
            refreshToken: refreshToken,
          } as User;
        } catch (error) {
          // Handle axios errors (401, 500, etc.) or other errors
          if (axios.isAxiosError(error)) {
            console.error("Login failed:", error.response?.data);
          }
          throw new InvalidLoginError()
        }
      },
    }),

    Credentials({
      id: "token-login",
      name: "Token Login",
      credentials: {
        accessToken: { label: "Token", type: "text" },
        refreshToken: { label: "Token", type: "text" },
        phone: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken && !credentials?.refreshToken && !credentials?.phone) return null;

        // اطمینان از اینکه accessToken یک string است
        const accessToken = String(credentials.accessToken);
        const refreshToken = String(credentials.refreshToken);
        const phone = String(credentials.phone);

        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
          phone: phone,
        };
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Persist tokens from authorize() onto the JWT
        // user is the object returned in authorize()
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  trustHost: true
})