import getAllUserTweets from "@/controllers/getAllUserTweets";
import { InfiniteTweetList } from "./TweetList";
import { getUserInfo } from "@kushal/utils";

interface UserTweetsProps {
    user: {
        id: string;
        username: string;
        name: string;
        avatar: string | null;
    };
    userId: string;
}

const UserTweets = async ({ user, userId }: UserTweetsProps) => {
    const logedinUser = await getUserInfo(userId);
    if (!logedinUser) {
        return;
    }
    const initialTweetResponse = await getAllUserTweets(
        userId,
        user.username,
        1,
    );

    if (initialTweetResponse.tweets.length === 0) {
        return (
            <div className="flex justify-center items-center h-96">
                <h1 className="text-2xl text-gray-500">No tweets found</h1>
            </div>
        );
    }

    return (
        <InfiniteTweetList
            initialTweets={initialTweetResponse.tweets}
            hasMore={initialTweetResponse.hasMore}
            user={logedinUser}
            username={user.username}
        />
    );
};

export default UserTweets;
