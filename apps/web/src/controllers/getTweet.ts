import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

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
    Comments: Array<Comment>;
    post?: Post;
    poll?: Poll;
}

interface Comment {
    id: string;
    text: string;
    createdAt: Date;
    username: string;
    name: string;
    userAvatar: string | null;
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
    tweet: Tweet | null;
}
const getTweet = async (
    tweetId: string,
    userId: string,
): Promise<TweetResponse> => {
    if (!tweetId) {
        return {
            success: false,
            message: "Invalid Tweet",
            tweet: null,
        };
    }
    try {
        const post = await db.tweet.findUnique({
            where: {
                id: tweetId,
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
                Comment: {
                    select: {
                        id: true,
                        text: true,
                        createdAt: true,
                        User: {
                            select: {
                                name: true,
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
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
        });
        if (!post) {
            return {
                success: false,
                message: "Tweet not found",
                tweet: null,
            };
        }
        const tweet = {
            id: post.id,
            username: post.anonymous ? "@Anonymous" : post.Author.username,
            name: post.anonymous ? "Anonymous" : post.Author.name,
            userAvatar: post.anonymous ? null : post.Author.avatar,
            comments: post._count.Comment,
            likes: post._count.Like,
            createdAt: post.createdAt,
            likedByYou: post.Like.length === 0 ? false : true,
            anonymous: post.anonymous,
            Comments: post.Comment.map((comment) => {
                return {
                    id: comment.id,
                    text: comment.text,
                    createdAt: comment.createdAt,
                    username: comment.User.username,
                    name: comment.User.name,
                    userAvatar: comment.User.avatar,
                };
            }),
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
        return {
            success: true,
            message: "Tweet fetched successfully",
            tweet,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong",
            tweet: null,
        };
    }
};

export default getTweet;
