"use server";

import { getToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
const db = new PrismaClient();

interface SignupResponse {
    success: boolean;
    message: string;
}

export const signup = async (
    name: string,
    email: string,
    username: string,
    password: string,
    collegeId: string,
): Promise<SignupResponse> => {
    try {
        const user = await db.user.create({
            data: {
                name,
                email,
                username,
                password,
                collegeId,
            },
            select: {
                id: true,
            },
        });
        const token = await getToken(user.id);
        const cookieStore = await cookies();
        cookieStore.set("token", token);
        return {
            success: true,
            message: "Signup successful",
        };
    } catch (error) {
        return {
            success: false,
            message: "An error occurred during signup",
        };
    }
};

export const isUsernameUnique = async (username: string): Promise<boolean> => {
    try {
        const user = await db.user.findFirst({
            where: {
                username,
            },
        });
        return !user;
    } catch (error) {
        return true;
    }
};

export const isEmailUnique = async (email: string): Promise<boolean> => {
    try {
        const user = await db.user.findFirst({
            where: {
                email,
            },
        });
        return !user;
    } catch (error) {
        return true;
    }
};

export const getListOfColleges = async () => {
    try {
        const colleges = await db.college.findMany({
            select: {
                name: true,
                location: true,
                id: true,
            },
        });
        return {
            success: true,
            data: colleges,
        };
    } catch (error) {
        return {
            data: [],
            success: false,
        };
    }
};

export const addNewCollege = async (name: string, location: string) => {
    try {
        const college = await db.college.create({
            data: {
                name,
                location,
            },
            select: {
                id: true,
                name: true,
                location: true,
            },
        });
        return {
            success: true,
            message: "College added successfully",
            data: college,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "An error occurred",
            data: null,
        };
    }
};
