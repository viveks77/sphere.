import { createClient } from "@/lib/supabase/server";
import { db } from "@/server/db/db";
import { file } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {PDFLoader} from 'langchain/document_loaders/fs/pdf';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { pineconeClient } from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { eq } from "drizzle-orm";

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
					uploadStatus: "PROCESSING",
				})
				.returning();
			
			try{
				console.log(fileResult[0].id);
				const response = await fetch(f.url);
				const blob = await response.blob();

				const loader = new PDFLoader(blob);

				const pageLevelDocs = await loader.load();

				const pageAmt = pageLevelDocs.length;
				
				const pineconeIndex = pineconeClient.index('pdfspace');
				
				//vector and index the entire document
				const embeddings = new GoogleGenerativeAIEmbeddings({
					modelName: "embedding-001", // 768 dimensions
					taskType: TaskType.TASK_TYPE_UNSPECIFIED,
					apiKey: process.env.GOOGLE_API_KEY
				});
				
				await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
					pineconeIndex,
					namespace: fileResult[0].id.toString()
				});
				
				await db.update(file).set({
					uploadStatus: "SUCCESS"
				}).where(eq(file.id, fileResult[0].id));

			}catch(e){
				console.log(e);
				await db.update(file).set({
					uploadStatus: "FAILED"
				}).where(eq(file.id, fileResult[0].id));
			}
			
			return { id: fileResult[0].id };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
