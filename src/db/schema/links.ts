import { sql } from 'drizzle-orm';
import {
    sqliteTable,
    text,
    integer,
} from 'drizzle-orm/sqlite-core';
import { users } from './users';

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
