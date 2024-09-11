import Link from 'next/link';
import UserButton from '@/components/UserButton';
import SearchField from '@/components/SearchField';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="hidden sm:inline text-green-500- text-xl sm:text-2xl font-bold">
          Kapil.
        </Link>
        <Link href="/" className="sm:hidden text-green-500- text-xl sm:text-2xl font-bold">
          K
        </Link>
        <SearchField />
        <UserButton className={'sm:ms-auto'} />
      </div>
    </header>
  );
};

export default Navbar;
