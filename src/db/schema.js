import {
    sqliteTable,
    text,
    integer,
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    hashedPassword: text('hashed_password').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(() => Date.now()),
});

export const links = sqliteTable('links', {
    id: text('id').primaryKey(),
    originalUrl: text('original_url').notNull(),
    shortSlug: text('short_slug').notNull().unique(),
    createdBy: text('created_by'),
    // .notNull()
    // .references(() => users.id), // Foreign key reference?
    createdAt: integer('created_at', { mode: 'timestamp' }).default(() => Date.now()),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).default(null),
    clickCount: integer('click_count').default(0),
    passwordHash: text('password_hash').default(null),
});

export const visits = sqliteTable('visits', {
    id: text('id').primaryKey(),
    linkId: text('link_id')
        .notNull()
        .references(() => links.id), // Foreign key reference?
    ipAddress: text('ip_address').notNull(),
    userAgent: text('user_agent').notNull(),
    referrer: text('referrer').default(null),
    country: text('country').default(null),
    clickedAt: integer('clicked_at', { mode: 'timestamp' }).default(() => Date.now()),
});
