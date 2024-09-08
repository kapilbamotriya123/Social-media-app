import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { UpdateUserProfileValues } from "@/lib/validation";
import { useUploadThing } from "@/lib/uploadthing";
import { updateProfile } from "@/app/(main)/users/[username]/action";
import { PostData, PostPage } from "@/lib/types";

export const useUpdateProfileMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const router = useRouter()

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
                         values,
                         avatar
                       }: { values: UpdateUserProfileValues; avatar?: File; }) => {
      return Promise.all([
        updateProfile(values), avatar && startAvatarUpload([avatar])
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      //get the new avatar url from the upload result
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

      //define the query filter
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

      //cancel the ongoing queries
      await queryClient.cancelQueries(queryFilter);

      //set the new query data
      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
         queryFilter,
         (oldData) => {
            if (!oldData) return;

            return {
               pageParams: oldData.pageParams,
               pages: oldData.pages.map((page) => ({
                  nextCursor: page.nextCursor,
                  posts: page.posts.map((post) => {
                     if (post.user.id === updatedUser.id) {
                        return {
                           ...post,
                           user: {
                              ...updatedUser,
                              avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                           },
                        };
                     }
                     return post;
                  }),
               })),
            };
         },
      );
      router.refresh();
      toast({
        description: 'Profile Updated'
      })

        },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: 'Failed to update user profile'
      })
    }
  });
  return mutation
}

