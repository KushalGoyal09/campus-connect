"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { addComment } from "./action";

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

export function CommentBox({ tweet, user }: TweetProps) {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [comments, setComments] = useState(tweet.Comments);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await addComment(
                user.id,
                tweet.id,
                newComment.trim(),
            );
            if (result.success) {
                setNewComment("");
                if (result.comment) {
                    setComments((comments) => [
                        {
                            id: result.comment.id,
                            text: newComment.trim(),
                            createdAt: result.comment.createdAt,
                            username: user.username,
                            name: user.name,
                            userAvatar: user.avatar,
                        },
                        ...comments,
                    ]);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(
                "An error occurred while posting your comment. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4 w-full max-w-2xl mx-auto my-4">
            <h2 className="text-xl font-semibold">
                Comments ({comments.length})
            </h2>

            <form onSubmit={handleSubmit} className="space-y-2">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full"
                    rows={3}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="flex space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                        <Avatar className="w-10 h-10">
                            <AvatarImage
                                src={comment.userAvatar || undefined}
                                alt={comment.name}
                            />
                            <AvatarFallback>
                                {comment.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold">
                                    {comment.name}
                                </span>
                                <span className="text-gray-500">
                                    @{comment.username}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {formatDistanceToNow(
                                        new Date(comment.createdAt),
                                        { addSuffix: true },
                                    )}
                                </span>
                            </div>
                            <p className="mt-1">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
