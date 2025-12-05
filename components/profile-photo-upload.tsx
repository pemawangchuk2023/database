"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X, Camera, Loader2 } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { toast } from "sonner";
import { updateProfilePhoto, removeProfilePhoto } from "@/actions/user";
import { useRouter } from "next/navigation";

interface ProfilePhotoUploadProps {
    currentPhoto?: string | null;
    userName: string;
}

export function ProfilePhotoUpload({ currentPhoto, userName }: ProfilePhotoUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentPhoto || null);
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
            toast.error("Please upload a valid image file (JPG, PNG, GIF, or WebP)");
            return;
        }

        // Validate file size (2MB)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            setPreview(base64String);

            // Upload immediately
            setIsUploading(true);
            const result = await updateProfilePhoto(base64String);
            setIsUploading(false);

            if (result.success) {
                toast.success("Profile photo updated successfully");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update profile photo");
                setPreview(currentPhoto || null);
            }
        };

        reader.readAsDataURL(file);
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        const result = await removeProfilePhoto();
        setIsRemoving(false);

        if (result.success) {
            setPreview(null);
            toast.success("Profile photo removed");
            router.refresh();
        } else {
            toast.error(result.error || "Failed to remove profile photo");
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <UserAvatar name={userName} image={preview} size="xl" />
                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={isUploading || isRemoving}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                        ) : (
                            <Camera className="h-6 w-6 text-white" />
                        )}
                    </button>
                </div>

                <div className="flex-1 space-y-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading || isRemoving}
                    />

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClick}
                            disabled={isUploading || isRemoving}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Photo
                                </>
                            )}
                        </Button>

                        {preview && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRemove}
                                disabled={isUploading || isRemoving}
                            >
                                {isRemoving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Removing...
                                    </>
                                ) : (
                                    <>
                                        <X className="mr-2 h-4 w-4" />
                                        Remove
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        JPG, PNG, GIF or WebP. Max size 2MB.
                    </p>
                </div>
            </div>
        </div>
    );
}
