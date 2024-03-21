import { createClient } from "@/lib/supabase/server";
import { db } from "@/server/db/db";
import { file } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
	pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
		.middleware(async ({ req }) => {
			const supabase = createClient();
			const { data, error } = await supabase.auth.getUser();
			if (error || !data.user) {
				throw new Error("Unauthroized");
			}
			return { userId: data.user.id };
		})
		.onUploadComplete(async ({ metadata, file: f }) => {
			const fileResult = await db
				.insert(file)
				.values({
					name: f.name,
					key: f.key,
					url: f.url,
					userId: metadata.userId,
					uploadStatus: "SUCCESS",
				})
				.returning();
			return { id: fileResult[0].id };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
