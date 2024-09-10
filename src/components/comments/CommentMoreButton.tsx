import { CommentsData } from '@/lib/types';

import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash } from 'lucide-react';
import DeleteCommentDialog from '@/components/comments/DeleteCommentDialog';

interface CommentMoreProps {
    comment: CommentsData;
    className: string;
}

const CommentMoreButton = ({ comment, className }: CommentMoreProps) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className={className} size="icon" variant={'ghost'}>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                        <span className="flex items-center gap-3 text-destructive">
                            <Trash />
                            Delete
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteCommentDialog
                comment={comment}
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
            ></DeleteCommentDialog>
        </>
    );
};

export default CommentMoreButton;