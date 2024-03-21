import { file } from "@/server/db/schema";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const fileRouter = createTRPCRouter({
    getUserFiles: privateProcedure.query(async ({ctx}) => {
        const {user, db} = ctx;
        const files = await db.query.file.findMany({
            where: eq(file.userId, user.id)
        })

        return files;
    }),
    deleteFile: privateProcedure.input(z.object({id: z.number()})).mutation(async( {input, ctx}) => {
        const {db, user} = ctx;
        const {id} = input;

        const fileResult = await db.query.file.findFirst({
            where: (file, {eq}) => and(eq(file.userId, user.id), eq(file.id, id))
        })

        if(!fileResult){
            throw new TRPCError({code: "NOT_FOUND"});
        }
        
        await db.delete(file).where(eq(file.id, id));
        return fileResult;
    }),
    getUserFile: privateProcedure.input(z.object({id: z.string()})).query(async ({input, ctx}) => {
        const {db, user} = ctx;
        const {id} = input;

        const fileResult = await db.query.file.findFirst({
            where: (file, {eq}) => and(eq(file.userId, user.id), eq(file.id, id))
        })

        if(!fileResult){
            throw new TRPCError({code: "NOT_FOUND"});
        }
        return fileResult;

    }),
    createFile: privateProcedure.input(z.object({name: z.string(), url: z.string(), key: z.string()})).mutation(async ({input, ctx}) => {
        const {db, user} = ctx;

        const result =await db.insert(file).values({
            ...input,
            userId: user.id,
            uploadStatus: "SUCCESS"
        }).returning();

        return result[0];
    })
})