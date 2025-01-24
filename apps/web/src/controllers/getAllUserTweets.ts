import { db } from "@kushal/prisma";

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

interface TweetResponse {
    success: boolean;
    message: string;
    tweets: Array<Tweet>;
    hasMore: boolean;
}

const getAllUserTweets = async (
    userId: string,
    username: string,
    page: number,
): Promise<TweetResponse> => {
    if (!userId) {
        return {
            success: false,
            message: "Invalid User",
            tweets: [],
            hasMore: false,
        };
    }
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                collegeId: true,
            },
        });
        if (!user) {
            return {
                success: false,
                message: "User not found",
                tweets: [],
                hasMore: false,
            };
        }
        const collegeId = user.collegeId;
        const skip = (page - 1) * 10;
        const data = await db.tweet.findMany({
            where: {
                Author: {
                    collegeId,
                    username,
                },
            },
            select: {
                id: true,
                Author: {
                    select: {
                        name: true,
                        username: true,
                        avatar: true,
                    },
                },
                anonymous: true,
                createdAt: true,
                _count: {
                    select: {
                        Like: true,
                        Comment: true,
                    },
                },
                Like: {
                    where: {
                        userId,
                    },
                    select: {
                        userId: true,
                    },
                },
                Post: {
                    select: {
                        text: true,
                        PostImage: {
                            select: {
                                imageUrl: true,
                                index: true,
                            },
                        },
                    },
                },
                Poll: {
                    select: {
                        text: true,
                        multipleOptions: true,
                        Option: {
                            select: {
                                id: true,
                                text: true,
                                index: true,
                                _count: {
                                    select: {
                                        Vote: true,
                                    },
                                },
                                Vote: {
                                    where: {
                                        userId,
                                    },
                                    select: {
                                        userId: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            take: 10,
            skip,
            orderBy: {
                createdAt: "desc",
            },
        });
        const totalPosts = await db.tweet.count({
            where: {
                Author: {
                    username,
                },
            },
        });
        const hasMore = skip + data.length < totalPosts;
        const tweets = data.map((post) => {
            return {
                id: post.id,
                username: post.anonymous ? "@Anonymous" : post.Author.username,
                name: post.anonymous ? "Anonymous" : post.Author.name,
                userAvatar: post.anonymous ? null : post.Author.avatar,
                comments: post._count.Comment,
                likes: post._count.Like,
                createdAt: post.createdAt,
                likedByYou: post.Like.length === 0 ? false : true,
                anonymous: post.anonymous,
                post: post.Post
                    ? {
                          text: post.Post.text,
                          postImage: post.Post.PostImage.map((image) => {
                              return {
                                  index: image.index,
                                  imageUrl: image.imageUrl,
                              };
                          }),
                      }
                    : undefined,
                poll: post.Poll
                    ? {
                          text: post.Poll.text,
                          multipleOptions: post.Poll.multipleOptions,
                          options: post.Poll.Option.map((option) => {
                              return {
                                  id: option.id,
                                  text: option.text,
                                  index: option.index,
                                  votes: option._count.Vote,
                                  votedByYou:
                                      option.Vote.length === 0 ? false : true,
                              };
                          }),
                      }
                    : undefined,
            };
        });
        return {
            success: true,
            message: "Posts are fetched successfully",
            tweets,
            hasMore,
        };
    } catch (error) {
        return {
            success: false,
            message: "Somthing is wrong",
            tweets: [],
            hasMore: false,
        };
    }
};

export default getAllUserTweets;
