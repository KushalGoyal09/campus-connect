import {db }from "@kushal/prisma"

interface Poll {
    text: string;
    multipleOptions: boolean;
    option: Array<string>;
}

interface Post {
    imageUrls: Array<string>;
    text: string;
}

interface AddTweetResponse {
    success: boolean;
    message: string;
}

const addTweet = async (
    userId: string,
    anonymous: boolean,
    { post, poll }: { post?: Post; poll?: Poll },
): Promise<AddTweetResponse> => {
    if (!post && !poll) {
        return {
            success: false,
            message: "Either post or poll is required",
        };
    }
    if (post && poll) {
        return {
            success: false,
            message: "Either post or poll is required",
        };
    }
    try {
        const tweet = await db.tweet.create({
            data: {
                authorId: userId,
                anonymous,
            },
            select: {
                id: true,
            },
        });
        if (post) {
            await db.post.create({
                data: {
                    tweetId: tweet.id,
                    text: post.text,
                    PostImage: {
                        createMany: {
                            data: post.imageUrls.map((imageUrl, index) => {
                                return {
                                    imageUrl,
                                    index,
                                };
                            }),
                        },
                    },
                },
            });
        }
        if (poll) {
            await db.poll.create({
                data: {
                    tweetId: tweet.id,
                    text: poll.text,
                    multipleOptions: poll.multipleOptions,
                    Option: {
                        createMany: {
                            data: poll.option.map((text, index) => {
                                return {
                                    text,
                                    index,
                                };
                            }),
                        },
                    },
                },
            });
        }
        return {
            success: true,
            message: "Tweet added successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to add tweet",
        };
    }
};

export default addTweet;
