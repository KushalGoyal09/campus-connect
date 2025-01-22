import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "./lib/auth";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.next({
            request,
        });
    }
    const userId = await getUserId(token);
    if (!userId) {
        return NextResponse.next({
            request,
        });
    }
    const headers = new Headers(request.headers);
    headers.set("x-user-id", userId);
    return NextResponse.next({
        request: {
            headers,
        },
    });
}
