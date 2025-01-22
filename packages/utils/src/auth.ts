import { SignJWT, jwtVerify } from "jose";
import { getJwtSecret } from "./constants";

export const getToken = async (userId: string) => {
    const secret = new TextEncoder().encode(getJwtSecret());
    const token = await new SignJWT({ sub: userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .sign(secret);
    return token;
};

export const getUserId = async (token: string) => {
    try {
        const secret = new TextEncoder().encode(getJwtSecret());
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
        });
        const userId = payload.sub;
        if (!userId) {
            throw new Error("Invalid token");
        }
        return userId;
    } catch (error) {
        console.log(error);
        return null;
    }
};
