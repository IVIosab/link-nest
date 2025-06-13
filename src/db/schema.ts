import { sql } from 'drizzle-orm';
import {
    sqliteTable,
    text,
    integer,
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    hashedPassword: text('hashed_password').notNull(),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
});

export const links = sqliteTable('links', {
    id: text('id').primaryKey(),
    originalUrl: text('original_url').notNull(),
    shortSlug: text('short_slug').notNull().unique(),
    createdBy: text('created_by').notNull().references(() => users.id),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
    expiresAt: text('expires_at').default(sql`NULL`),
    clickCount: integer('click_count').notNull().default(0),
    passwordHash: text('password_hash').default(sql`NULL`),
});

export const visits = sqliteTable('visits', {
    id: text('id').primaryKey(),
    linkId: text('link_id').notNull().references(() => links.id),
    ipAddress: text('ip_address').notNull(),
    userAgent: text('user_agent').notNull(),
    referrer: text('referrer').default(sql`NULL`),
    country: text('country').default(sql`NULL`),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
});
