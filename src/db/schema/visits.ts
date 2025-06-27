
import { sql } from 'drizzle-orm';
import {
    sqliteTable,
    text,
} from 'drizzle-orm/sqlite-core';
import { links } from './links';

export const visits = sqliteTable('visits', {
    id: text('id').primaryKey(),
    linkId: text('link_id').notNull().references(() => links.id),
    ipAddress: text('ip_address').notNull(),
    userAgent: text('user_agent').notNull(),
    referrer: text('referrer').default(sql`NULL`),
    country: text('country').default(sql`NULL`),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
});
