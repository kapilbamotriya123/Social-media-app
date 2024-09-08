import { Button } from '@/components/ui/button';
import { Files, Image } from 'lucide-react';
import { useRef } from 'react';

interface AddAttachmentsButtonProps {
   onFileSelected: (files: File[]) => void;
   disabled: boolean;
}

const AddAttachmentsButton = ({
   onFileSelected,
   disabled,
}: AddAttachmentsButtonProps) => {
   const fileInputRef = useRef<HTMLInputElement>(null);

   return (
      <>
         <Button
            variant="ghost"
            size={'icon'}
            disabled={disabled}
            className="text-primary hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
         >
            <Image size={20} />
         </Button>
         <input
            type="file"
            accept="image/*, video/*"
            multiple
            ref={fileInputRef}
            className="sr-only hidden"
            onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if(files.length) {
                    onFileSelected(files);
                    e.target.value=''
                }
            }}
         />
      </>
   );
};

export default AddAttachmentsButton;
