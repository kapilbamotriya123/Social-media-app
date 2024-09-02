import { Prisma } from '@prisma/client';

export const UserDataSelect = {
  username: true,
  displayName: true,
  avatarUrl: true
} as Prisma.UserSelect;

export const PostDataInclude = {
  user: {
    select: UserDataSelect
  }
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof PostDataInclude;
}>;
