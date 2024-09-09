import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';

export interface Attachment {
   file: File;
   isUploading: boolean;
   mediaId?: string;
}

const useMediaUpload = () => {
   const { toast } = useToast();

   const [attachments, setAttachments] = useState<Attachment[]>([]);

   const [uploadProgress, setUploadProgress] = useState<number>();

   const { startUpload: startAttachmentUpload, isUploading } = useUploadThing(
      'attachment',
      {
         onBeforeUploadBegin(files) {
            const renamedFiles = files.map((file) => {
               const extension = file.name.split('.').pop(); //this gives the last extension of the app ie.png/webp/mp4 etc
               return new File(
                  [file],
                  `attachment_${crypto.randomUUID()}.${extension}`,
                  { type: file.type },
               );
            });
            setAttachments((prev) => [
               ...prev,
               ...renamedFiles.map((file) => ({ file, isUploading: true })),
            ]);
            return renamedFiles;
         },
         onUploadProgress: setUploadProgress,
         onClientUploadComplete(res) {
            setAttachments((prev) =>
               prev.map((a) => {
                  const uploadResult = res.find((r) => r.name === a.file.name);

                  if (!uploadResult) {
                     return a;
                  }

                  return {
                     ...a,
                     isUploading: false,
                     mediaId: uploadResult.serverData.mediaId,
                  };
               }),
            );
         },
         onUploadError(e) {
            setAttachments((prev) => prev.filter((a) => !a.isUploading));
            toast({
               variant: 'destructive',
               description: e.message,
            });
         },
      },
   );
   const handleStartUpload = (files: File[]) => {
      if (isUploading) {
         toast({
            variant: 'destructive',
            description: 'please wait for current upload to finish',
         });
      }

      if (attachments.length + files.length > 5) {
         toast({
            variant: 'destructive',
            description: 'you can only upload 5 attachments per post',
        });
        return
      }
      startAttachmentUpload(files);
   };
   const removeAttachment = (fileName: string)  => {
    setAttachments(prev => prev.filter(a => a.file.name !== fileName))
   }

   const reset = () => {
    setAttachments([])
    setUploadProgress(undefined)
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset
  }   
};


export default useMediaUpload