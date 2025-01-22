"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X } from "lucide-react";
import { toggleLike, toggleVote } from "./action";
import { toast } from "@/hooks/use-toast";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import TimeAgo from "@/components/TimeAgo";

interface TweetProps {
    tweet: {
        id: string;
        name: string;
        username: string;
        userAvatar: string | null;
        comments: number;
        likes: number;
        likedByYou: boolean;
        createdAt: Date;
        anonymous: boolean;
        Comments: Array<Comment>;
        post?: Post;
        poll?: Poll;
    };
    user: {
        id: string;
        avatar: string | null;
        name: string;
        username: string;
    };
}

interface Post {
    text: string;
    postImage: Array<{
        index: number;
        imageUrl: string;
    }>;
}

interface Poll {
    text: string;
    multipleOptions: boolean;
    options: Array<Option>;
}

interface Option {
    id: string;
    text: string;
    index: number;
    votes: number;
    votedByYou: boolean;
}

interface Comment {
    id: string;
    text: string;
    createdAt: Date;
    username: string;
    name: string;
    userAvatar: string | null;
}


const Tweet = ({  tweet, user }: TweetProps) => {
    const [likes, setLikes] = useState(tweet.likes);
    const [liked, setLiked] = useState(tweet.likedByYou);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [pollOptions, setPollOptions] = useState(tweet.poll?.options || []);
    const router = useRouter();

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const result = await toggleLike(user.id, tweet.id);
        if (result.success) {
            setLikes(liked ? likes - 1 : likes + 1);
            setLiked(!liked);
        } else {
            toast({
                title: "Error",
                description: result.message,
            });
        }
    };

    const handleVote = async (optionId: string) => {
        const result = await toggleVote(user.id, optionId);
        if (!result.success) {
            toast({
                title: "Error",
                description: result.message,
            });
        } else {
            setPollOptions(result.updatedOption || []);
        }
    };

    const handleImageClick = (imageUrl: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImage(imageUrl);
    };

    return (
        <>
            <Card className="w-full max-w-2xl mx-auto my-4 hover:bg-gray-50 transition-colors duration-200">
            <CardHeader className="flex flex-row items-center space-x-4">
                <Avatar
                    onClick={(e) => {
                        if (!tweet.anonymous)
                            router.push(`/user/${tweet.username}`);
                    }}
                    className="cursor-pointer"
                >
                    <AvatarImage
                        src={
                            tweet.anonymous
                                ? "/anonymous.png"
                                : tweet.userAvatar || undefined
                        }
                    />
                    <AvatarFallback>
                        {tweet.anonymous ? "A" : tweet.name[0]}
                    </AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-2">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!tweet.anonymous)
                                router.push(`/user/${tweet.username}`);
                        }}
                        className="cursor-pointer"
                    >
                        <h2 className="text-lg font-semibold">
                            {tweet.anonymous ? "Anonymous User" : tweet.name}
                        </h2>
                        {!tweet.anonymous && (
                            <p className="text-sm text-gray-500">
                                @{tweet.username}
                            </p>
                        )}
                    </div>
                    <span className="text-sm text-gray-500">
                        <TimeAgo date={tweet.createdAt} />
                    </span>
                </div>
            </CardHeader>
                <CardContent>
                    {tweet.post && (
                        <div>
                            <p className="text-lg mb-4">{tweet.post.text}</p>
                            {tweet.post.postImage.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {tweet.post.postImage.map((img) => (
                                        <Image
                                            key={img.index}
                                            src={
                                                img.imageUrl ||
                                                "/placeholder.svg"
                                            }
                                            alt="Post image"
                                            width={300}
                                            height={300}
                                            className="rounded-lg w-full h-48 object-contain border cursor-zoom-in"
                                            onClick={(e) =>
                                                handleImageClick(
                                                    img.imageUrl,
                                                    e,
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {tweet.poll && (
                        <div className="mt-4">
                            <p className="text-lg mb-2">{tweet.poll.text}</p>
                            {pollOptions.map((option) => (
                                <Button
                                    key={option.index}
                                    variant={
                                        option.votedByYou
                                            ? "default"
                                            : "outline"
                                    }
                                    className="w-full justify-between mb-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVote(option.id);
                                    }}
                                >
                                    <span>{option.text}</span>
                                    <span className="text-sm">
                                        {option.votes} votes
                                    </span>
                                </Button>
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Button variant="ghost" size="sm">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        {tweet.comments}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLike}>
                        <Heart
                            className={cn(
                                "w-5 h-5 mr-2",
                                liked && "fill-red-500 text-red-500",
                            )}
                        />
                        {likes}
                    </Button>
                </CardFooter>
            </Card>
            <Dialog
                open={selectedImage === null ? undefined : true}
                onOpenChange={() => setSelectedImage(null)}
            >
                <DialogContent className="max-w-4xl">
                    <DialogTitle></DialogTitle>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                    <div className="flex justify-center items-center h-full">
                        {selectedImage && (
                            <Image
                                src={selectedImage}
                                alt="Enlarged post image"
                                width={800}
                                height={600}
                                className="max-h-[80vh] w-auto object-contain transition-transform duration-200 ease-in-out"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Tweet;
