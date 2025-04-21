import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      apiKey: string;
      apiUrl: string;
      credits: number;
    };
  }
} 