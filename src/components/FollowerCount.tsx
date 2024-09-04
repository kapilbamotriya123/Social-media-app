'use client';

import { FollowerInfo } from '@/lib/types';
import useFollowerInfo from '@/hooks/useFollowerInfo';

interface FollowerCountProps {
   userId: string;
   initialState: FollowerInfo;
}

const FollowCount = ({ userId, initialState }: FollowerCountProps) => {
   const { data } = useFollowerInfo(userId, initialState);

   return (
      <span>
         Followers: <span className={'font-bold'}>{data.followers}</span>
      </span>
   );
};

export default FollowCount;
