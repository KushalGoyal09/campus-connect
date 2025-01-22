"use server";

import { PrismaClient } from "@prisma/client";
import {
    getAwsKey,
    getAwsRegion,
    getAwsSecret,
    getS3Bucket,
} from "@/lib/constants";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const db = new PrismaClient();

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

export const createTweet = async (
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
                    Tweet: {
                        connect: {
                            id: tweet.id,
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
                    Tweet: {
                        connect: {
                            id: tweet.id,
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

export const getpresignedUrl = async (fileName: string, fileType: string) => {
    const client = new S3Client({
        region: getAwsRegion(),
        credentials: {
            accessKeyId: getAwsKey(),
            secretAccessKey: getAwsSecret(),
        },
    });

    const command = new PutObjectCommand({
        Bucket: getS3Bucket(),
        Key: `uploads/${Date.now()}-${fileName}`,
        ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(client, command);
    const url = new URL(presignedUrl);
    const imageUrl = url.origin + url.pathname;
    return {
        presignedUrl,
        imageUrl,
    };
};
