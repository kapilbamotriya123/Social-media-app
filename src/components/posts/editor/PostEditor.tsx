'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import submitPost from '@/components/posts/editor/action';
import UserAvatar from '@/components/UserAvatar';
import { useSessionContext } from '@/app/(main)/SessionContextProvider';
import { Button } from '@/components/ui/button';
import './styles.css';

const PostEditor = () => {
  const { user } = useSessionContext();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false
      }),
      Placeholder.configure({
        placeholder: 'Jaldi se likh do kuch...'
      })
    ]
  });

  const input =
    editor?.getText({
      blockSeparator: '/n'
    }) || '';

  const onSubmit = async () => {
    await submitPost(input);
    editor?.commands.clearContent();
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] min-h-[2rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Create Post
        </Button>
      </div>
    </div>
  );
};

export default PostEditor;
