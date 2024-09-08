import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import CropImageDialog from '@/components/CropImageDialog';
import LoadingButton from '@/components/LoadingButton';
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserData } from '@/lib/types';
import {
   updateUserProfileSchema,
   UpdateUserProfileValues,
} from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Resizer from 'react-image-file-resizer';
import { Button } from '@/components/ui/button';
import { useUpdateProfileMutation } from "@/app/(main)/users/[username]/mutations";
import AvatarInput from "@/app/(main)/users/[username]/AvatarInput";

interface EditProfileDialogProps {
   user: UserData;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

const EditProfileDialog = ({
   user,
   open,
   onOpenChange,
}: EditProfileDialogProps) => {
   const form = useForm<UpdateUserProfileValues>({
      resolver: zodResolver(updateUserProfileSchema),
      defaultValues: {
         displayName: user.displayName,
         bio: user.bio || '',
      },
   });

   const mutation = useUpdateProfileMutation()

  //we will use another use state for var croppedAvatar because we want to upload cropped avatar if it is present
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null)


   const onSubmit = async (values: UpdateUserProfileValues) => {
     //here we define the newAvatar file which we do by converting the blob returned by cropper into file and update the mutation accordingly
     const newAvatarFile = croppedAvatar
     ? new File([croppedAvatar], `avatar_${user.username}.webp`)
       : undefined


      mutation.mutate(
        {
           values,
          avatar: newAvatarFile
        },
        {
           onSuccess: () => {
              setCroppedAvatar(null)
              onOpenChange(false);
           },
        },
      );
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Edit profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-1.5">
               <Label>Avatar</Label>
            {/*  here we will show the avatar in the dialog if the avatar is there and if not we will show the placeholder avatar als*/}
              <AvatarInput src={
                croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                  : user.avatarUrl || avatarPlaceholder
              } onImageCropped={setCroppedAvatar} />


            </div>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
               >
                  <FormField
                     control={form.control}
                     name="displayName"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Display name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Your display name"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="bio"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Bio</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Tell us a little bit about yourself"
                                 className="resize-none"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <DialogFooter>
                     <LoadingButton type="submit" loading={mutation.isPending}>Save</LoadingButton>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};

export default EditProfileDialog;

//the avatar input is completely started again from scratch

