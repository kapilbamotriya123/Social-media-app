import {Metadata} from "next";
import Image from "next/image";
import signUpImage from '@/assets/signup-image.jpg'
import Link from "next/link";
import SignUpForm from "@/app/(auth)/signup/SignUpForm";

export const metadata: Metadata = {
    title: 'Sign Up'
}

const signUpPage = () => {
    return (
        <main className='flex h-screen items-center justify-center p-5'>
            <div
                className='flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl shadow-2xl bg-card'>
                <div className='w-full space-y-10 overflow-y-auto p-10 md:w-1/2'>
                    <div className='space-y-1 text-center'>
                        <h1 className='text-3xl font-bold'>Sign Up to Kapil&#39;s App</h1>
                        <p className='text-muted-foreground'>a place where you can find friend</p>
                    </div>
                    <div className='space-y-5'>
                        <SignUpForm />
                        <Link href='/login' className='block text-center hover:underline'>
                            Already have an account? Log in
                        </Link>
                    </div>
                </div>
                <Image
                    src={signUpImage}
                    alt="sign up image"
                    className='hidden w-1/2 object-cover md:block'
                />

            </div>
        </main>
    )
}

export default signUpPage