'use server'

import {loginSchema, loginValues} from "@/lib/validation";
import prisma from "@/lib/prisma";
import {verify} from "@node-rs/argon2";
import {lucia} from "@/auth";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {isRedirectError} from "next/dist/client/components/redirect";

const loginIn = async (credentials: loginValues): Promise<{ error: string }> => {
    try {

        const {username, password} = loginSchema.parse(credentials)

        const existingUser = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive'
                }
            }
        })

        if (!existingUser || !existingUser.passwordHash) {
            return {
                error: 'invalid username or password'
            }
        }
        const validPassword = await verify(existingUser.passwordHash, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        })

        if (!validPassword) {
            return {
                error: 'invalid username or password'
            }
        }

        const session = await lucia.createSession(existingUser.id, {})
        const sessionCookie = lucia.createSessionCookie(session.id)

        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )

        return redirect('/')
    } catch(error) {
        if(isRedirectError(error)) throw error;
        return {
            error: 'something went wrong '
        }
    }
}