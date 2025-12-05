"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    name?: string;
    image?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl",
};

export function UserAvatar({ name = "User", image, size = "md", className }: UserAvatarProps) {
    // Get initials from name
    const getInitials = (name: string) => {
        const words = name.trim().split(" ");
        if (words.length >= 2) {
            return `${words[0][0]}${words[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <Avatar className={cn(sizeClasses[size], className)}>
            {image && <AvatarImage src={image} alt={name} />}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    );
}
