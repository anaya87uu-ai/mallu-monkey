import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

const Layout = () => (
  <div className="min-h-screen flex flex-col relative">
    <div className="ambient-bg" aria-hidden="true" />
    <Header />
    <main className="flex-1 pt-16 pb-20 md:pb-0">
      <Outlet />
    </main>
    <Footer />
    <BottomNav />
  </div>
);

export default Layout;
