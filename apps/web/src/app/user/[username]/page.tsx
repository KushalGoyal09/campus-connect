import NotFound from "@/components/NotFound";
import getUserData from "@/controllers/getUserData";
import { getUserInfoFromUsername } from "@kushal/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import UserProfile from "./Profile";
import UnauthorizedPage from "@/components/ErrorPage";
import UserTweets from "./UserTweets";

export default async function UserPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const userId = (await headers()).get("x-user-id");
    if (!userId) {
        redirect("/login");
    }
    const { username } = await params;
    const user = await getUserInfoFromUsername(username);
    if (!user) {
        return <NotFound />;
    }
    const userData = await getUserData(userId,username);
    if (!userData.user) {
        return <UnauthorizedPage/>
    } 
    return (
        <>
            <UserProfile user={userData.user} />
            <UserTweets user={user} userId={userId} />
        </>
    );
}
