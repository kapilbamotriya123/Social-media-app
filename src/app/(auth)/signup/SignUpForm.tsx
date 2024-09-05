'use client';

import { useForm } from 'react-hook-form';
import { signUpSchema, signUpValues } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useTransition } from 'react';
import signUp from '@/app/(auth)/signup/actions';
import PasswordInput from '@/components/passwordInput';
import LoadingButton from '@/components/LoadingButton';

const SignUpForm = () => {
   const [error, setError] = useState<string>();
   const [isPending, startTransition] = useTransition();

   const form = useForm<signUpValues>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         email: '',
         username: '',
         password: '',
      },
   });

   const onSubmit = async (values: signUpValues) => {
      setError(undefined);
      startTransition(async () => {
         const { error } = await signUp(values);
         if (error) setError(error);
      });
   };
   return (
      <div>
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className={'space-y-3'}
            >
               {error && (
                  <p className={'text-center text-destructive'}> {error}</p>
               )}
               <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                           <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Email"
                              type={'email'}
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <PasswordInput placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <LoadingButton
                  loading={isPending}
                  type="submit"
                  className="w-full"
               >
                  Create account
               </LoadingButton>
            </form>
         </Form>
      </div>
   );
};

export default SignUpForm;
