"use client";

import UploadButton from "@/components/UploadButton";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Plus, MessageSquare, Loader2, Trash, Ghost } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import FileCard from "@/components/common/FileCard";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
	const {data: files, isLoading} = api.file.getUserFiles.useQuery();
	
	return (
		<main className="mx-auto max-w-7xl md:p-10">
			<div className="mt-8 flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:items-center sm:gap-0'">
				<h1 className="mb-3 font-bold text-5xl">My Files</h1>
				<UploadButton />
			</div>

			{files && files?.length !== 0 ? (
				<div>
					<ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{files
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
							.map((file) => (
								<FileCard file={file} key={file.id} />
							))}
					</ul>
				</div>
			) : isLoading ? (
				<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({length: 3}, (_, i) => i +1).map((_, i) => <Skeleton key={i} className="h-[137px] col-span-1 divide-y text-card-foreground rounded-lg" />)}
				</div>
			) : (
				<div className="mt-16 flex flex-col items-center gap-2">
					<Ghost className="h-8 w-8 text-zinc-800" />
					<h3 className="font-semibold text-xl">Pretty empty around here</h3>
					<p>Let&apos;s upload your first PDF.</p>
				</div>
			)}
		</main>
	);
};

export default Dashboard;
