import { pgTable, text, timestamp, boolean, integer, serial } from "drizzle-orm/pg-core"

// ---------------------------------------------------------------------------
// Better Auth tables (column names are camelCase to match Better Auth defaults)
// ---------------------------------------------------------------------------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// ---------------------------------------------------------------------------
// Application tables
// ---------------------------------------------------------------------------

// One row per user with their gamification state and enrollment info.
export const profile = pgTable("profile", {
  userId: text("userId").primaryKey(),
  role: text("role").notNull().default("student"),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  username: text("username").notNull(),
  grade: text("grade").notNull().default(""),
  division: text("division").notNull().default(""),
  xp: integer("xp").notNull().default(0),
  streakDays: integer("streakDays").notNull().default(0),
  lastActiveDate: text("lastActiveDate"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// One row per completed activity attempt.
export const activityResult = pgTable("activity_result", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  activityId: text("activityId").notNull(),
  subjectId: text("subjectId").notNull(),
  correctCount: integer("correctCount").notNull(),
  totalCount: integer("totalCount").notNull(),
  score: integer("score").notNull(),
  xpEarned: integer("xpEarned").notNull(),
  timeSec: integer("timeSec").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// One row per badge a user has unlocked.
export const unlockedBadge = pgTable("unlocked_badge", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  badgeId: text("badgeId").notNull(),
  unlockedAt: timestamp("unlockedAt").notNull().defaultNow(),
})
