import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account && account.provider === 'google') {
        console.log('Google ID Token:', account.id_token)
        token.idToken = account.id_token
      }
      return token
    },
    session: async ({ session, token }) => {
      session.idToken = token.idToken as string
      return session
    },
  },
})

export { handler as GET, handler as POST }