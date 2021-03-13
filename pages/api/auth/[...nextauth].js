import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN
    })
  ],
  database: process.env.MONGODB_URI,
  callbacks: {
    async session(session, token) {
      return Promise.resolve({ ...session, user: { ...session.user, id: token.id } })
    }
  }
});
