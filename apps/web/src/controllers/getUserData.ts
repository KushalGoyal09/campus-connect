import { PrismaClient, Gender } from "@prisma/client";
const db = new PrismaClient();

export interface UserDataResponse {
    success: boolean;
    message: string;
    user: User | null;
}

export interface User {
    id: string;
    name: string;
    username:string;
    email:string;
    avatar: string | null;
    bio: string | null;
    gender: Gender | null;
    isSameUser: boolean;
    College: {
        id: string;
        name: string;
        location: string;
    };
}

const getUserData = async (
    userId: string,
    username: string,
): Promise<UserDataResponse> => {
    const collegeId = await db.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            collegeId: true,
        },
    });
    if (!collegeId) {
        return {
            success: false,
            user: null,
            message: "Not Authorized",
        };
    }
    const user = await db.user.findUnique({
        where: {
            username,
            collegeId: collegeId.collegeId,
        },
        select: {
            id: true,
            name: true,
            username: true,
            email:true,
            bio: true,
            avatar: true,
            gender: true,
            College: {
                select: {
                    id: true,
                    name: true,
                    location: true,
                },
            },
        },
    });

    if (!user) {
        return {
            success: false,
            message: "Not Authorized",
            user: null,
        };
    }
    return {
        success: true,
        message: "User information successfully fetched",
        user: {
            ...user,
            isSameUser: user.id === userId
        },
    };
};

export default getUserData;
