
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string| null;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    accessToken: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
    name?: string;
    email?: string;
    picture?: string;
  }
}
