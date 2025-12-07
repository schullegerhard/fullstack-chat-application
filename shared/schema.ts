import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { Badge } from "../client/src/lib/constants";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const identities = pgTable("identities", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  hash: text("hash").notNull(),
  name: text("name").default("CryptoExplorer"),
  reputation: integer("reputation").default(785),
  firstActive: timestamp("first_active").defaultNow(),
  badges: jsonb("badges").default([]),
  importedFrom: jsonb("imported_from")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertIdentitySchema = createInsertSchema(identities).pick({
  address: true,
  hash: true,
  name: true,
  reputation: true,
  badges: true,
  importedFrom: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertIdentity = z.infer<typeof insertIdentitySchema>;
export type Identity = typeof identities.$inferSelect & {
  badges: Badge[]
};
