import { db } from "@kushal/prisma";

interface ToggleVoteResponse {
    success: boolean;
    message: string;
    updatedOption?: Array<Option>;
}

interface Option {
    id: string;
    text: string;
    index: number;
    votes: number;
    votedByYou: boolean;
}

const toggleVote = async (
    userId: string,
    optionId: string,
): Promise<ToggleVoteResponse> => {
    try {
        const poll = await db.option.findUnique({
            where: {
                id: optionId,
            },
            select: {
                Poll: {
                    select: {
                        multipleOptions: true,
                        id: true,
                    },
                },
            },
        });
        if (!poll) {
            return {
                success: false,
                message: "Post not found",
            };
        }
        const vote = await db.vote.findUnique({
            where: {
                userId_optionId: {
                    userId: userId,
                    optionId: optionId,
                },
            },
        });
        if (vote) {
            await db.vote.delete({
                where: {
                    userId_optionId: {
                        userId: userId,
                        optionId: optionId,
                    },
                },
            });
            return {
                success: true,
                message: "Vote removed",
                updatedOption: await getUpdatedOptions(poll.Poll.id, userId),
            };
        }

        if (poll.Poll.multipleOptions) {
            await db.vote.create({
                data: {
                    userId: userId,
                    optionId: optionId,
                },
            });
            return {
                success: true,
                message: "Vote added",
                updatedOption: await getUpdatedOptions(poll.Poll.id, userId),
            };
        } else {
            await db.vote.deleteMany({
                where: {
                    Option: {
                        pollId: poll.Poll.id,
                    },
                    userId: userId,
                },
            });
            await db.vote.create({
                data: {
                    userId: userId,
                    optionId: optionId,
                },
            });
            return {
                success: true,
                message: "Vote added",
                updatedOption: await getUpdatedOptions(poll.Poll.id, userId),
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Somthing is wrong",
        };
    }
};

export default toggleVote;

const getUpdatedOptions = async (pollId: string, userId: string) => {
    const poll = await db.poll.findUnique({
        where: {
            id: pollId,
        },
        select: {
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
                orderBy: {
                    index: "asc",
                }
            },
        },
    });
    if (!poll) {
        return;
    }
    return poll.Option.map((option) => {
        return {
            id: option.id,
            text: option.text,
            index: option.index,
            votes: option._count.Vote,
            votedByYou: option.Vote.length === 0 ? false : true,
        };
    });
};
