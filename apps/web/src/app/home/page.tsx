import { InfiniteTweetList } from "./InfiniteTweetList";
import { getUserInfo } from "@/lib/getUserInfo";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import getAllTweets from "@/controllers/getAllTweets";

export default async function Home() {
    const userId = (await headers()).get("x-user-id");
    if (!userId) {
        redirect("/login");
    }
    const user = await getUserInfo(userId);
    if (!user) {
        redirect("/login");
    }
    const initialTweetResponse = await getAllTweets(userId, 1);

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Feed</h1>
            <InfiniteTweetList
                initialTweets={initialTweetResponse.tweets}
                hasMore={initialTweetResponse.hasMore}
                user={user}
            />
        </main>
    );
}
