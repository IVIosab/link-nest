import { sql } from 'drizzle-orm';
import {
    sqliteTable,
    text,
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    hashedPassword: text('hashed_password').notNull(),
    createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
});
