import { pineconeClient } from "@/lib/pinecone";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export async function GET() {
	try {
		const supabase = createClient();
		const { data } = (await supabase.rpc("expired_files")) as { data: { id: number; name: string; key: string }[] };

        if(data.length === 0){
            return NextResponse.json({result: "no expired files"}, {status: 200});
        }

        const pineconeIndex = pineconeClient.index("pdfspace");
        
        const uploadThing = new UTApi();

		const { success } = await uploadThing.deleteFiles(data.map((f) => f.key));

		if (!success) {
			throw new Error("Failed to delete file");
		}

		await pineconeIndex._deleteMany(data.map((f) => f.id.toString()));

		await supabase.from('file').delete().eq('id', data.map((f) => f.id));

		return NextResponse.json({ result: data.length });
	} catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
	}
}
