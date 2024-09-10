import { CommentsData } from '@/lib/types';
import useDeletePostMutation from '@/components/posts/mutations';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { useDeleteCommentMutation } from './mutations';

interface DeleteCommentDialogProps {
    comment: CommentsData;
    open: boolean;
    onClose: () => void;
}

const DeleteCommentDialog = ({ comment, open, onClose }: DeleteCommentDialogProps) => {
    const mutation = useDeleteCommentMutation();

    const handleOpenChange = (open: boolean) => {
        if (!open || !mutation.isPending) onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete comment?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this comment?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <LoadingButton
                        loading={mutation.isPending}
                        variant={'destructive'}
                        onClick={() => mutation.mutate(comment.id, { onSuccess: onClose })}
                    >
                        Delete
                    </LoadingButton>
                    <Button
                        variant={'outline'}
                        onClick={onClose}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteCommentDialog;