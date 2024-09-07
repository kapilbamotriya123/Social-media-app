/*
//for avatar input this is a bit complex but very important
import { useRef, useState } from 'react';
import Image, { StaticImageData } from "next/image";

interface AvatarInputProps {
   src: string | StaticImageData;
   onImageCropped: (blob: Blob) => void;
}

const AvatarInput = ({ src, onImageCropped }: AvatarInputProps) => {
   const [imageToCrop, setImageToCrop] = useState<File >();

   const fileInputRef = useRef<HTMLInputElement>(null);



   const onImageSelected = (image: File | undefined) => {
     if(!image) return
      //
   };

   return (
      <>
         <input
            type={'file'}
            accept="image/*"
            onChange={(e) => onImageSelected(e.target.files?.[0])}
            className={'sr-only hidden'}
         />
         <button
            type={'button'}
            onClick={() => fileInputRef.current?.click()}
            className={'group relative block'}
         >
           <Image
           src={src}
           alt={'avatar preview'}
           width={150}
           height={150}
           className={'size 32 flex-none object-cover rounded-full'}
           />
         </button>
      </>
   );
};


export default AvatarInput


 */