"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

const UploadButton = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
        <Dialog open={isOpen} onOpenChange={(v: boolean) => {
            if(!v){
                setIsOpen(v);
            }
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button>Upload PDF</Button>
            </DialogTrigger>
            <DialogContent>
                This is content
            </DialogContent>
        </Dialog>    
    );
};

export default UploadButton;
