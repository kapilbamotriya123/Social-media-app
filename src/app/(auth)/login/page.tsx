import { Metadata } from "next";
import Image from "next/image";
import loginImage from '@/assets/iitd.webp'
import LoginForm from "./LoginForm";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";

export const metadata: Metadata = {
  title: 'Login'
}

const LoginPage = () => {
    return (
      <main className='flex h-screen items-center justify-center p-5 '>
        <div className='flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl'>
          <div className='w-full space-y-10 overflow-y-auto p-10 md:w-1/2'>
            <h1 className={'text-3xl font-bold text-center'}>Login to Kapil&#39;s app</h1>
            {/* <div className={'space-y-5'}> */}
              <GoogleSignInButton />
              {/* <div className="flex items-center gap-3">
                <div className="h-px bg-muted flex-1" />
                <span>OR</span>
                <div className="h-px bg-muted flex-1" />
              </div> */}
              <LoginForm />
            {/* </div> */}
            <Link href='/signup' className='block text-center hover:underline'>Don&#39;t have an account? Sign up</Link>
          </div>
          <Image src={loginImage} alt='login page image' className='hidden w-1/2 md:block object-cover '/>
        </div>
      </main>

    )
}

export default LoginPage