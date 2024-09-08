import 'cropperjs/dist/cropper.css';
import { useRef } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { Button } from './ui/button';
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from './ui/dialog';

//Now when The image is selected we want to show this crop dialog which will take the selected image as prop along with , cropAspectRatio, onCropped, onClose

interface CropImageDialogProps {
   src: string;
   cropAspectRatio: number;
   onCropped: (blob: Blob | null) => void;
   onClose: () => void;
}

const CropImageDialog = ({
   src,
   cropAspectRatio,
   onCropped,
   onClose,
}: CropImageDialogProps) => {
   //from here we will use the react-cropper package to crop the image which will get the image and send the cropped image back to our editProfileDialog for further actions

   const cropperRef = useRef<ReactCropperElement>(null);

   //this is the function which will get called when we click crop so that it can fetch and send the cropped image to onCropped prop
   const crop = () => {
      const cropper = cropperRef.current?.cropper;
      if (!cropper) return;
      cropper
         .getCroppedCanvas()
         .toBlob((blob) => onCropped(blob), 'image/webp');
      onClose();
   };

   return (
     <Dialog open onOpenChange={onClose}>
        <DialogContent>
           <DialogHeader>
              <DialogTitle>Crop Image</DialogTitle>
           </DialogHeader>
           <Cropper
              src={src}
              aspectRatio={cropAspectRatio}
              guides={false}
              zoomable={false}
              ref={cropperRef}
              className={'mx-auto size-fit'}
              />
           <DialogFooter>
              <Button variant={"secondary"} onClick={onClose}>cancel</Button>
              <Button onClick={crop}>Crop</Button>

           </DialogFooter>
        </DialogContent>
     </Dialog>
   )
};

export default CropImageDialog
