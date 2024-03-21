"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const UploadDropzone = () => {
	const router = useRouter();
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const {toast} = useToast();

	const { startUpload } = useUploadThing("pdfUploader", {
		onClientUploadComplete: (files) => {
			const file = files[0];
			if(!file){
				toast({
					variant: "destructive",
					title: "File upload failed",
					description: "Something went wrong. Please try again later"
				})
			}
			router.push(`/dashboard/${file.serverData.id}`);
		},
		onUploadError: (error) => {
			toast({
				variant: "destructive",
				title: "File upload failed",
				description: "Something went wrong. Please try again later"
			})
		},
		onUploadProgress: (progress) => setUploadProgress(progress),
		onUploadBegin: () => {
			setIsUploading(true);
		},
	});

	return (
		<Dropzone
			multiple={false}
			onDrop={async (acceptedFile) => {
				setIsUploading(true);
				await startUpload(acceptedFile)
			}}>
			{({ getRootProps, getInputProps, acceptedFiles }) => (
				<div {...getRootProps()} className="border h-64 m-4 border-dashed border-border rounded-lg">
					<div className="flex items-center justify-center h-full w-full">
						<label
							htmlFor="dropzone-file"
							className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-secondary hover:bg-secondary/50">
							<div className="flex flex-col items-center justify-center pt-5 pb-6">
								<Cloud className="h-6 w-6 text-secondary-foreground mb-2" />
								<p className="mb-2 text-sm text-secondary-foreground">
									<span className="font-semibold">Click to upload</span> or drag and drop
								</p>
								<p className="text-xs text-zinc-500">PDF (up to MB)</p>
							</div>
							{acceptedFiles && acceptedFiles[0] ? (
								<div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
									<div className="px-3 py-2 h-full grid place-items-center">
										<File className="h-4 w-4 text-blue-500" />
									</div>
									<div className="px-3 py-2 h-full text-sm truncate">{acceptedFiles[0].name}</div>
								</div>
							) : null}

							{isUploading ? (
								<div className="w-full mt-4 max-w-xs mx-auto">
									<Progress value={uploadProgress} className="h-1 w-full" />
									{uploadProgress === 100 ? (
										<div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
											<Loader2 className="h-3 w-3 animate-spin" />
											Redirecting...
										</div>
									) : null}
								</div>
							) : null}
						</label>
					</div>
				</div>
			)}
		</Dropzone>
	);
};

const UploadButton = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(v: boolean) => {
				if (!v) {
					setIsOpen(v);
				}
			}}>
			<DialogTrigger onClick={() => setIsOpen(true)} asChild>
				<Button>Upload PDF</Button>
			</DialogTrigger>
			<DialogContent>
				<UploadDropzone />
			</DialogContent>
		</Dialog>
	);
};

export default UploadButton;
