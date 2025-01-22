import { headers } from "next/headers";

export default async function Home() {
    const userId = (await headers()).get(`x-user-id`);
    if (!userId) {
        return (
            <>
                <h1> You are not logged in </h1>
            </>
        );
    }
    return (
        <>
            <h1>hello</h1>
            <h1>You are logged in</h1>
            <h1>{userId}</h1>
        </>
    );
}
