import Link from 'next/link';
import UserButton from '@/components/UserButton';
import SearchField from '@/components/SearchField';

const Navbar = () => {
  return (
    <div className="-10 sticky top-0 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          Kapil.
        </Link>
        <SearchField />
        <UserButton className={'sm:ms-auto'} />
      </div>
    </div>
  );
};

export default Navbar;
