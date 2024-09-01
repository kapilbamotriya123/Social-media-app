'use client'

import { useSessionContext } from "@/app/(main)/SessionContextProvider";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/UserAvatar";
import { UserIcon } from "lucide-react";
import Link from "next/link";

interface UserButtonProps {
  className? : string
}

const UserButton = ({className} : UserButtonProps) => {
  const {user} = useSessionContext()
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <button >
          <UserAvatar avatarUrl={user.avatarUrl} size ={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          logged in as @{user.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem>
              <UserIcon className='mr-2 size-4' />
              Profile
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton