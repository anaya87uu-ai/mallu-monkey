import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import { useAuthSession } from "@/hooks/useAuthSession";

const Layout = () => {
  const { isLoggedIn } = useAuthSession();

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="ambient-bg" aria-hidden="true" />
      <Header />
      <main
        className="flex-1 pt-16 md:pb-0"
        style={{
          paddingBottom: isLoggedIn
            ? "calc(env(safe-area-inset-bottom) + 6rem)"
            : "env(safe-area-inset-bottom)",
        }}
      >
        <Outlet />
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      {isLoggedIn && <BottomNav />}
    </div>
  );
};

export default Layout;
