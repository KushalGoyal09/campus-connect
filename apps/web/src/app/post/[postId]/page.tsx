import { redirect } from "next/navigation";
import { headers } from "next/headers";
import getTweet from "@/controllers/getTweet";
import Tweet  from "@/app/post/[postId]/Tweet";
import { getUserInfo } from "@kushal/utils";
import NotFound from "@/components/NotFound";
import { CommentBox } from "./CommentBox";

export default async function Page({
    params,
}: {
    params: Promise<{ postId: string }>;
}) {
    const { postId } = await params;
    const userId = (await headers()).get("x-user-id");

    if (!userId) {
        redirect("/login");
    }
    const user = await getUserInfo(userId);
    if (!user) {
        redirect("/login");
    }
    const { tweet } = await getTweet(postId, userId);
    if (!tweet) {
        return <NotFound />;
    }

    return (
        <div>
            <Tweet user={user} tweet={tweet} />
            <CommentBox user={user} tweet={tweet} />
        </div>
    );
}
