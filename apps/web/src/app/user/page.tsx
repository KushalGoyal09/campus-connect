import { getUserInfo } from "@kushal/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserPage() {
    const userId = (await headers()).get("x-user-id");

    if (!userId) {
        redirect("/login");
    }
    const user = await getUserInfo(userId);
    if (!user) {
        redirect("/login");
    }

    redirect(`/user/${user.username}`);
}
