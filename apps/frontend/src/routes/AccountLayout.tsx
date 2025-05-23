import { Outlet } from "react-router";
import { Header } from "../components/layout/Header.tsx";
import { Footer } from "../components/layout/Footer.tsx";

export default function AccountLayout() {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col justify-between min-h-[calc(100vh-62px)]">
        <main className="bg-background xlg:p-8 flex flex-1 flex-col gap-10 p-4 lg:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
