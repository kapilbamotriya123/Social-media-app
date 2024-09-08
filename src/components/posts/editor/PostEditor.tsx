'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import UserAvatar from '@/components/UserAvatar';
import { useSessionContext } from '@/app/(main)/SessionContextProvider';
import './styles.css';
import useSubmitPostMutation from '@/components/posts/editor/mutations';
import LoadingButton from '@/components/LoadingButton';
import useMediaUpload from './useMediaUploads';
import AddAttachmentsButton from './AddAttachmentsButton';
import AttachmentPreviews from './AttachmentsPreview';
import { Loader2 } from 'lucide-react';

const PostEditor = () => {
   const { user } = useSessionContext();

   const mutation = useSubmitPostMutation();

   const {
      startUpload,
      attachments,
      reset: resetMediaUploads,
      isUploading,
      removeAttachment,
      uploadProgress,
   } = useMediaUpload();

   const editor = useEditor({
      extensions: [
         StarterKit.configure({
            bold: false,
            italic: false,
         }),
         Placeholder.configure({
            placeholder: 'Jaldi se likh do kuch...',
         }),
      ],
   });

   const input =
      editor?.getText({
         blockSeparator: '/n',
      }) || '';

   const onSubmit = () => {
      mutation.mutate(
         {
            content: input,
            mediaIds: attachments
               .map((a) => a.mediaId)
               .filter(Boolean) as string[], //this is done in order to remove the get only the media ids and filter is there to use only the defined values
         },
         {
            onSuccess: () => {
               editor?.commands.clearContent();
               resetMediaUploads();
            },
         },
      );
   };

   return (
      <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-sm">
         <div className="flex gap-5">
            <UserAvatar
               avatarUrl={user.avatarUrl}
               className="hidden sm:inline"
            />
            <EditorContent
               editor={editor}
               className="max-h-[20rem] min-h-[2rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
            />
            <AttachmentPreviews attachments={attachments} removeAttachment={removeAttachment} />
         </div>
         <div className="flex justify-end items-center gap-3">
            {!!isUploading && (
               <>
                  <span className='text-sm'>{uploadProgress ?? 0 }%</span>
                  <Loader2 className='size-5 animate-spin text-primary' />
               </>
            )}
            <AddAttachmentsButton onFileSelected={startUpload} disabled = {isUploading || attachments.length >= 5 }/>
            <LoadingButton
               onClick={onSubmit}
               loading={mutation.isPending}
               disabled={!input.trim() || isUploading}
               className="min-w-20"
            >
               Create Post
            </LoadingButton>
         </div>
      </div>
   );
};

export default PostEditor;
