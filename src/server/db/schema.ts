
import {pgTable, pgEnum, serial, text, varchar, timestamp, uuid} from 'drizzle-orm/pg-core';

export const uploadStatusEnum = pgEnum("upload_status", ["PENDING", "PROCESSING", "FAILED", "SUCCESS"])

export const file = pgTable('file', {
    id: serial('id').primaryKey(),
    name: text('name'),
    uploadStatus: uploadStatusEnum('upload_status'),
    url: text('url'),
    key: text('key'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: uuid('user_id').notNull(),
})

export type fileType = typeof file.$inferSelect;