"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage } from "@/lib/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
    label?: string;
}

export function ImageUploader({ value, onChange, folder = "images", label = "Image" }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setProgress(0);

        // Create a unique file name
        const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const storageRef = ref(storage, `${folder}/${uniqueName}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error("Upload failed", error);
                alert("Upload failed. Please try again.");
                setIsUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                onChange(downloadURL);
                setIsUploading(false);
            }
        );
    };

    return (
        <div className="space-y-4">
            <Label>{label}</Label>
            {value ? (
                <div className="relative w-full max-w-md aspect-video border rounded-md overflow-hidden bg-muted">
                    <Image src={value} alt="Uploaded" fill className="object-cover" />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full w-8 h-8"
                        onClick={() => onChange("")}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <Input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleFileChange}
                        className="cursor-pointer"
                    />
                    {isUploading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{Math.round(progress)}%</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
