import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#C8102E"),
  league: text("league").notNull(),
  founded: integer("founded"),
  stadium: text("stadium"),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  teamId: varchar("team_id").references(() => teams.id),
  position: text("position").notNull(),
  age: integer("age"),
  nationality: text("nationality"),
  photoUrl: text("photo_url"),
  marketValue: decimal("market_value", { precision: 10, scale: 2 }),
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  appearances: integer("appearances").default(0),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  homeTeamId: varchar("home_team_id").notNull().references(() => teams.id),
  awayTeamId: varchar("away_team_id").notNull().references(() => teams.id),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  status: text("status").notNull().default("scheduled"), // scheduled, live, completed, postponed
  matchDate: timestamp("match_date").notNull(),
  venue: text("venue"),
  league: text("league").notNull(),
  season: text("season").notNull(),
  currentTime: integer("current_time").default(0),
  events: jsonb("events").default([]),
});

export const transfers = pgTable("transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull().references(() => players.id),
  fromTeamId: varchar("from_team_id").references(() => teams.id),
  toTeamId: varchar("to_team_id").references(() => teams.id),
  transferFee: decimal("transfer_fee", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("rumor"), // rumor, confirmed, completed
  transferDate: timestamp("transfer_date"),
  announcedAt: timestamp("announced_at").defaultNow(),
  season: text("season").notNull(),
});

export const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en"),
  contentAr: text("content_ar").notNull(),
  contentEn: text("content_en"),
  summary: text("summary"),
  imageUrl: text("image_url"),
  category: text("category").notNull(), // breaking, transfer, match, analysis
  priority: integer("priority").default(1), // 1-5, 5 being highest
  isBreaking: boolean("is_breaking").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  views: integer("views").default(0),
  authorId: varchar("author_id").references(() => users.id),
  tags: text("tags").array(),
});

// Relations
export const teamsRelations = relations(teams, ({ many }) => ({
  players: many(players),
  homeMatches: many(matches, { relationName: "homeTeam" }),
  awayMatches: many(matches, { relationName: "awayTeam" }),
  transfersFrom: many(transfers, { relationName: "fromTeam" }),
  transfersTo: many(transfers, { relationName: "toTeam" }),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
  transfers: many(transfers),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  homeTeam: one(teams, {
    fields: [matches.homeTeamId],
    references: [teams.id],
    relationName: "homeTeam",
  }),
  awayTeam: one(teams, {
    fields: [matches.awayTeamId],
    references: [teams.id],
    relationName: "awayTeam",
  }),
}));

export const transfersRelations = relations(transfers, ({ one }) => ({
  player: one(players, {
    fields: [transfers.playerId],
    references: [players.id],
  }),
  fromTeam: one(teams, {
    fields: [transfers.fromTeamId],
    references: [teams.id],
    relationName: "fromTeam",
  }),
  toTeam: one(teams, {
    fields: [transfers.toTeamId],
    references: [teams.id],
    relationName: "toTeam",
  }),
}));

export const newsRelations = relations(news, ({ one }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
});

export const insertTransferSchema = createInsertSchema(transfers).omit({
  id: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  publishedAt: true,
  views: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertTransfer = z.infer<typeof insertTransferSchema>;
export type Transfer = typeof transfers.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

// Extended types with relations
export type MatchWithTeams = Match & {
  homeTeam: Team;
  awayTeam: Team;
};

export type TransferWithDetails = Transfer & {
  player: Player;
  fromTeam?: Team;
  toTeam?: Team;
};

export type PlayerWithTeam = Player & {
  team?: Team;
};
