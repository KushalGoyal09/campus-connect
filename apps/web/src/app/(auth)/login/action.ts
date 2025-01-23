"use server";

import { getToken } from "@kushal/utils";
import { db } from "@kushal/prisma";
import { cookies } from "next/headers";

interface LoginResponse {
    success: boolean;
    message: string;
}

export const login = async (
    identifier: string,
    password: string,
): Promise<LoginResponse> => {
    try {
        const user = await db.user.findFirst({
            where: {
                OR: [
                    {
                        username: identifier,
                    },
                    {
                        email: identifier,
                    },
                ],
                password: password,
            },
            select: {
                id: true,
            },
        });
        if (!user) {
            return {
                success: false,
                message: "Invalid username or password",
            };
        }
        const token = await getToken(user.id);
        const cookieStore = await cookies();
        cookieStore.set("token", token);
        return {
            success: true,
            message: "Logged in",
        };
    } catch (error) {
        return {
            success: false,
            message: "An error occurred",
        };
    }
};
