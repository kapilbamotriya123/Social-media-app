'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

const SearchField = () => {
   const router = useRouter();

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const q = (form.q as HTMLInputElement).value.trim();
      if (!q) return;
      router.push(`/search/?q=${encodeURIComponent(q)}`);
   };
   return (
      <form onSubmit={handleSubmit} method={'GET'} action="/search" className=''>
         <div className="relative">
            <Input name={'q'} placeholder={'Search'} className={'pe-10'} />
            <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
         </div>
      </form>
   );
};

export default SearchField;
