import { FollowerInfo } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useFollowerInfo from '@/hooks/useFollowerInfo';
import kyInstance from '@/lib/ky';
import { Button } from '@/components/ui/button';

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

const FollowButton = ({ userId, initialState }: FollowButtonProps) => {
  const { data } = useFollowerInfo(userId, initialState);

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.delete(`/api/users/${userId}/followers`)
  });

  return (
    <Button
      variant={data.isFollowedByUser ? 'secondary' : 'default'}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
