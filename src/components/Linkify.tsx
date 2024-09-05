import { LinkIt, LinkItUrl } from 'react-linkify-it';
import Link from 'next/link';
import React from 'react';

interface LinkifyProps {
   children: React.ReactNode;
}

const LinkifyUsername = ({ children }: LinkifyProps) => {
   return (
      <LinkIt
         regex={/(@[a-zA-Z0-9_-]+)/}
         component={(match, key) => (
            <Link
               key={key}
               href={`/users/${match.slice(1)}`}
               className={'text-primary hover:underline'}
            >
               {match}
            </Link>
         )}
      >
         {children}
      </LinkIt>
   );
};

const LinkifyHashtag = ({ children }: LinkifyProps) => {
   return (
      <LinkIt
         component={(match, key) => (
            <Link
               key={key}
               href={`/hashtag/${match.slice(1)}`}
               className={'text-primary hover:underline'}
            >
               {match}
            </Link>
         )}
         regex={/(#[a-zA-Z0-9_-]+)/}
      >
         {children}
      </LinkIt>
   );
};

const LinkifyUrl = ({ children }: LinkifyProps) => {
   return (
      <LinkItUrl className={'text-primary hover:underline'}>
         {children}
      </LinkItUrl>
   );
};

const Linkify = ({ children }: LinkifyProps) => {
   return (
      <LinkifyHashtag>
         <LinkifyUsername>
            <LinkifyUrl>{children}</LinkifyUrl>
         </LinkifyUsername>
      </LinkifyHashtag>
   );
};

export default Linkify;
