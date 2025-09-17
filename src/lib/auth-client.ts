import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  fetchOptions: {
    onError(e) {
      if (e.error.status === 401) {
        window.location.href = "/";
      }
    },
  },
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient