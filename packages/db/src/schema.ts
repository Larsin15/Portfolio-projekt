import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  index,
  unique,
} from "drizzle-orm/pg-core";

// ============================================================
// AUTH TABLES
// ============================================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  // Per-user encryption salt for deriving data encryption key
  encryptionSalt: varchar("encryption_salt", { length: 64 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("idx_sessions_user_id").on(table.userId)]
);

// ============================================================
// PORTFOLIO TABLES
// ============================================================

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  demoType: varchar("demo_type", { length: 50 }).notNull(), // 'static', 'interactive', 'personality_miner'
  techStack: jsonb("tech_stack").default([]),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================================
// PERSONALITY MINER TABLES (Encrypted)
// ============================================================

/**
 * User's initial aspects/topics they want to explore.
 * Content is encrypted with user's derived key.
 */
export const pmAspects = pgTable(
  "pm_aspects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Encrypted JSON: { aspects: string[] }
    encryptedData: text("encrypted_data").notNull(),
    iv: varchar("iv", { length: 32 }).notNull(), // 16 bytes hex
    authTag: varchar("auth_tag", { length: 32 }).notNull(), // 16 bytes hex
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("idx_pm_aspects_user_id").on(table.userId)]
);

/**
 * Personality Miner sessions (question batches).
 */
export const pmSessions = pgTable(
  "pm_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionNumber: integer("session_number").notNull(),
    status: varchar("status", { length: 20 }).default("in_progress"), // 'in_progress', 'completed', 'abandoned'
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_pm_sessions_user_id").on(table.userId),
    unique("unique_user_session_number").on(table.userId, table.sessionNumber),
  ]
);

/**
 * LLM-generated questions per session.
 * Questions are encrypted.
 */
export const pmQuestions = pgTable(
  "pm_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => pmSessions.id, { onDelete: "cascade" }),
    questionOrder: integer("question_order").notNull(),
    // Encrypted question text
    encryptedQuestion: text("encrypted_question").notNull(),
    iv: varchar("iv", { length: 32 }).notNull(),
    authTag: varchar("auth_tag", { length: 32 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_pm_questions_session_id").on(table.sessionId),
    unique("unique_session_question_order").on(table.sessionId, table.questionOrder),
  ]
);

/**
 * User answers to questions.
 * Answers are encrypted.
 */
export const pmAnswers = pgTable(
  "pm_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => pmQuestions.id, { onDelete: "cascade" }),
    // Encrypted answer text
    encryptedAnswer: text("encrypted_answer").notNull(),
    iv: varchar("iv", { length: 32 }).notNull(),
    authTag: varchar("auth_tag", { length: 32 }).notNull(),
    answeredAt: timestamp("answered_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("idx_pm_answers_question_id").on(table.questionId)]
);

/**
 * Generated mirror contexts (profiles).
 * Content is encrypted markdown.
 */
export const pmMirrorContexts = pgTable(
  "pm_mirror_contexts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => pmSessions.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    // Encrypted markdown content
    encryptedContent: text("encrypted_content").notNull(),
    iv: varchar("iv", { length: 32 }).notNull(),
    authTag: varchar("auth_tag", { length: 32 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_pm_mirror_contexts_user_id").on(table.userId),
    unique("unique_user_version").on(table.userId, table.version),
  ]
);

// ============================================================
// RATE LIMITING
// ============================================================

export const rateLimits = pgTable("rate_limits", {
  key: varchar("key", { length: 255 }).primaryKey(),
  count: integer("count").default(1),
  windowStart: timestamp("window_start", { withTimezone: true }).defaultNow(),
});

// ============================================================
// TYPE EXPORTS
// ============================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type PmSession = typeof pmSessions.$inferSelect;
export type PmQuestion = typeof pmQuestions.$inferSelect;
export type PmAnswer = typeof pmAnswers.$inferSelect;
export type PmMirrorContext = typeof pmMirrorContexts.$inferSelect;

