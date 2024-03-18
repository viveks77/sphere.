import { file } from "@/server/db/schema";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { eq } from "drizzle-orm";

export const fileRouter = createTRPCRouter({
    getUserFiles: privateProcedure.query(async ({ctx}) => {
        const {user, db} = ctx;
        return await db.query.file.findMany({
            where: eq(file.userId, user.id)
        })
    })
})