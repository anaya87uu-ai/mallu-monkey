import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

const Layout = () => (
  <div className="min-h-screen flex flex-col relative">
    <div className="ambient-bg" aria-hidden="true" />
    <Header />
    <main
      className="flex-1 pt-16 md:pb-0"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" }}
    >
      <Outlet />
    </main>
    <div className="hidden md:block">
      <Footer />
    </div>
    <BottomNav />
  </div>
);

export default Layout;
