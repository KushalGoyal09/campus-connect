import { PrismaClient } from "@prisma/client";

export const db = global.db || new PrismaClient();

declare global {
  var db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "development") global.db = db;

export * from "@prisma/client";
