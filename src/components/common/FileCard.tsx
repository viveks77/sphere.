"use client";

import { type fileType } from "@/server/db/schema";
import { format } from "date-fns";
import { Plus, MessageSquare, Trash, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { api } from "@/trpc/react";

type Props = {
	file: fileType;
};

const FileCard = ({ file }: Props) => {
	const utils = api.useUtils();

	const { mutateAsync: deleteFile, isPending } = api.file.deleteFile.useMutation({
		onError: (error) => {
			console.log(error);
		},
		onSuccess: (data) => {
			console.log(data);
			utils.file.getUserFiles.invalidate();
		},
	});

	const deleteRecord = async () => {
		await deleteFile({ id: file.id });
	};

	return (
		<li className="border-border border-2 col-span-1 text-card-foreground rounded-lg bg-card shadow transition hover:shadow-lg">
			<Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
				<div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
					<div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
					<div className="flex-1 truncate">
						<div className="flex items-center space-x-3">
							<h3 className="truncate text-lg font-medium">{file.name}</h3>
						</div>
					</div>
				</div>
			</Link>

			<div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-muted-foreground">
				<div className="flex items-center gap-2">
					<Plus className="h-4 w-4" />
					{format(new Date(file.createdAt), "MMM yyyy")}
				</div>

				<div className="flex items-center gap-2">
					<MessageSquare className="h-4 w-4" />
					mocked
				</div>

				<Button onClick={deleteRecord} size="sm" className="w-full" variant="destructive">
					{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
				</Button>
			</div>
		</li>
	);
};

export default FileCard;
