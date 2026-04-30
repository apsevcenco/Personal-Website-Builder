import { pgTable, serial, jsonb, timestamp } from "drizzle-orm/pg-core";

export const siteContentTable = pgTable("site_content", {
  id: serial("id").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SiteContentRow = typeof siteContentTable.$inferSelect;
