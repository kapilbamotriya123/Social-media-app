import {lucia, validateRequest} from "@/auth";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

const logOut = async () => {
    const {session}  = await validateRequest();

    if(!session) {
        throw new Error('unauthorized')
    }

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    )
    return redirect('/login')
}