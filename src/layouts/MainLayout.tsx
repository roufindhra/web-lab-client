import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Navbar } from "./Navbar";
import { Sidebar, type NavItem } from "./Sidebar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import CartDrawer from "@/components/CartDrawer";
import Footer from "./Footer";

type MenuItem = NavItem & { authRequired?: boolean };

const menuItems: MenuItem[] = [
  { label: "Beranda", path: "/" },
  { label: "Dashboard", path: "/dashboard", authRequired: true },
  { label: "Peminjaman Alat", path: "/alat", authRequired: true },
  { label: "Sewa Alat", path: "/sewa" },
  { label: "Pembelajaran", path: "/akademik"},
  { label: "Riset", path:"/riset" },
  { label: "Design System Test", path: "/test" },
];

export default function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { items: cartItems, isCartOpen, openCart, closeCart } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const visibleMenuItems: NavItem[] = menuItems.filter(
    (item) => !item.authRequired || isAuthenticated,
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onLogout={() => void logout()}
        cartCount={isAuthenticated ? cartItems.length : 0}
        onOpenCart={isAuthenticated ? openCart : undefined}
        user={
          isAuthenticated && user
            ? { name: user.nama, role: user.role }
            : undefined
        }
      />

      <div className="flex flex-1">
        <Sidebar
          items={visibleMenuItems}
          isOpenMobile={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        <div className="flex flex-1 flex-col">
          <main className="flex-1 overflow-x-clip p-4 md:p-6">
            {/* overflow-x-clip, bukan -hidden: hidden menjadikan main scroll container
                dan mematikan position:sticky (TOC scroll-spy) di halaman di dalamnya */}
            <Breadcrumb />
            <Outlet />
          </main>
          <div className="mt-8 border-t pt-4">
            <Footer companyName="Laboratorium Survei Geodesi dan Geometri - UPN Veteran Yogyakarta" />
          </div>
        </div>
      </div>

      {isCartOpen && <CartDrawer onClose={closeCart} />}
    </div>
  );
}
