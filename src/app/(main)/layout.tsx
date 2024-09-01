import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionContextProvider from "@/app/(main)/SessionContextProvider";
import Navbar from "@/app/(main)/Navbar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await validateRequest();

  if (!session.user) {
    redirect("/login");
  }
  return <SessionContextProvider value={session}>
    <Navbar />
    {children}
  </SessionContextProvider>;
};

export default MainLayout;