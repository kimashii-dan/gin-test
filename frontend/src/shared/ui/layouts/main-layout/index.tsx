import { Outlet } from "react-router";
import Header from "../header";
import Footer from "../footer";
import StickyFooter from "../sticky-footer";

export default function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>

      <Footer />

      <StickyFooter />
    </>
  );
}
