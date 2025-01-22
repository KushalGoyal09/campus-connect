"use client";

import { useEffect, useState } from "react";
import { getAllTweets } from "./action";
import { useInView } from "react-intersection-observer";
import { Tweet } from "./Tweet";
import { Spinner } from "./Spinner";

interface Tweet {
    id: string;
    name: string;
    username: string;
    userAvatar: string | null;
    comments: number;
    likes: number;
    likedByYou: boolean;
    createdAt: Date;
    anonymous: boolean;
    post?: Post;
    poll?: Poll;
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

interface TweetListProps {
    initialTweets: Array<Tweet>;
    hasMore: boolean;
    user: {
        id: string;
        avatar: string | null;
        name: string;
        username: string;
    };
}

export function InfiniteTweetList({
    initialTweets,
    hasMore: initialHasMore,
    user,
}: TweetListProps) {
    const [tweets, setTweets] = useState(initialTweets);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMoreTweets();
        }
    }, [inView, hasMore]);

    const loadMoreTweets = async () => {
        setLoading(true);
        try {
            const data = await getAllTweets(user.id, page + 1);
            if (data.success) {
                setTweets((prevTweets) => [...prevTweets, ...data.tweets]);
                setHasMore(data.hasMore);
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error("Failed to fetch more tweets:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} tweet={tweet} user={user} />
            ))}
            {hasMore && (
                <div ref={ref} className="flex justify-center py-4">
                    {loading ? <Spinner /> : <p>Load more tweets...</p>}
                </div>
            )}
        </div>
    );
}
