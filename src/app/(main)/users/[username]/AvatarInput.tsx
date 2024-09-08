import { useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { input } from 'zod';
import { Camera } from 'lucide-react';
import CropImageDialog from '@/components/CropImageDialog';
import Resizer from 'react-image-file-resizer';

interface AvatarInputProps {
   src: string | StaticImageData;
   onImageCropped: (blob: Blob | null) => void;
}

const AvatarInput = ({ src, onImageCropped }: AvatarInputProps) => {
   //we will use state to set the image to crop
   const [imageToCrop, setImageToCrop] = useState<File>(); //here it only accepts file

   const fileInputRef = useRef<HTMLInputElement>(null);

   const onImageSelected = (image: File | undefined) => {
      if (!image) return;
      //rest of the logic we will build once we build the ui for selecting Image
      //first we will resize the image then we will pass on this image to imageToCrop
      Resizer.imageFileResizer(
         image,
         1024, //max width
         1024, //max height
         'WEBP', //compress type
         100, //quality
         0, //rotation
         (uri) => setImageToCrop(uri as File), //the image to crop accept only File  so we have to hard code the type
         'file',
      );
   };

   return (
      <>
         <input
            type={'file'}
            accept="image/*"
            onChange={(e) => onImageSelected(e.target.files?.[0])}
            ref={fileInputRef}
            className="sr-only hidden"
         />
         <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative block"
         >
            <Image
               src={src}
               alt={'avatar preview'}
               width={150}
               height={150}
               className="size-32 flex-none rounded-full object-cover"
            />
            <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
               <Camera size={24} />
            </span>
         </button>
            {imageToCrop && (
               <CropImageDialog
                  src={URL.createObjectURL(imageToCrop)}
                  cropAspectRatio={1}
                  onCropped={onImageCropped}
                  onClose={() => {
                    setImageToCrop(undefined);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
               />
            )}
      </>
   );
};

export default AvatarInput;
