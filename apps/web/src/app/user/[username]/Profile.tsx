"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, MapPin, GraduationCap } from "lucide-react";
import EditProfileForm from "./EditProfileForm";
import Link from "next/link";

interface User {
    id: string;
    name: string;
    avatar: string | null;
    bio: string | null;
    username: string;
    email: string;
    gender: Gender | null;
    isSameUser: boolean;
    College: {
        id: string;
        name: string;
        location: string;
    };
}

type Gender = "Male" | "Female" | "Other";

const UserProfile = ({ user }: { user: User }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                    {user.name}
                </CardTitle>
                {user.isSameUser && (
                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                            </DialogHeader>
                            <EditProfileForm
                                user={user}
                                onClose={() => setIsEditing(false)}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage
                            src={user.avatar || undefined}
                            alt={user.name}
                        />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold">{user.name}</h2>
                        {user.gender && (
                            <Badge variant="secondary" className="mt-1">
                                {user.gender}
                            </Badge>
                        )}
                    </div>
                </div>
                {user.bio && (
                    <p className="text-muted-foreground">{user.bio}</p>
                )}
                <div className="flex justify-between">
                    <div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <GraduationCap className="w-4 h-4" />
                            <span>{user.College.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{user.College.location}</span>
                        </div>
                    </div>
                    <div>
                        <Link href={`/message/${user.username}`}>
                            <Button> Message </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserProfile;
