import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    /**
     * On first sign-in, upsert the user document in MongoDB.
     * Subsequent logins update `last_login_at`.
     */
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        await User.findOneAndUpdate(
          { google_id: account.providerAccountId },
          {
            email: user.email,
            name: user.name,
            image: user.image,
            google_id: account.providerAccountId,
            last_login_at: new Date(),
          },
          { upsert: true, new: true }
        );
      }
      return true;
    },

    /**
     * Persist the MongoDB user _id and google_id into the JWT.
     */
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        const dbUser = await User.findOne({
          google_id: account.providerAccountId,
        }).lean();
        if (dbUser) {
          token.userId = (dbUser as { _id: { toString: () => string } })._id.toString();
        }
      }
      return token;
    },

    /**
     * Expose userId on the client-facing session object.
     */
    async session({ session, token }) {
      if (token.userId) {
        (session as unknown as { userId: string }).userId = token.userId as string;
      }
      return session;
    },
  },
});
