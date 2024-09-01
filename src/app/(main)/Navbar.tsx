import Link from "next/link";
import UserButton from "@/components/UserButton";

const Navbar = () => {
  return (
    <div className="sticky bg-card top-0 -10 shadow-sm">
      <div className="mx-auto flex items-center max-w-7xl flex-wrap justify-center gap-5 px-5 py-3">
        <Link href='/' className='text-2xl font-bold text-primary ' >Kapil.</Link>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;