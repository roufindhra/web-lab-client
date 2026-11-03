import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Navbar, type NavItem } from "./Navbar";
// import { Breadcrumb } from "@/components/ui/Breadcrumb";
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
  // { label: "Design System Test", path: "/test" },
];

export default function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { items: cartItems, isCartOpen, openCart, closeCart } = useCart();

  const visibleMenuItems: NavItem[] = menuItems.filter(
    (item) => !item.authRequired || isAuthenticated,
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="sticky mx-auto max-w-7xl w-full px-4 md:px-6 pt-4 text-left font-semibold text-primary flex items-center gap-4 bg-surface">
        <img src="/logo_upn.png" alt="Logo UPN" className="h-18 w-auto" /> 
          <p>
            PROGRAM STUDI TEKNIK GEOMATIKA <br />
            FAKULTAS TEKNOLOGI MINERAL <br />
            UPN "VETERAN" YOGYAKARTA
          </p>
        <img src="/blu-diktisaintek-1032.webp" alt="BLU DIKTISAINTEK" className="h-18 w-auto" /> 
      </div>
      <Navbar
        items={visibleMenuItems}
        onLogout={() => void logout()}
        cartCount={isAuthenticated ? cartItems.length : 0}
        onOpenCart={isAuthenticated ? openCart : undefined}
        user={
          isAuthenticated && user
            ? { name: user.nama, role: user.role }
            : undefined
        }
      />

      <main className="flex-1 overflow-x-clip">
        {/* overflow-x-clip, bukan -hidden: hidden menjadikan main scroll container
            dan mematikan position:sticky (TOC scroll-spy) di halaman di dalamnya */}
        {/* <Breadcrumb /> */}
        <Outlet />
      </main>

      <div className="mt-8 border-t pt-4">
        <Footer companyName="Laboratorium Survei Geodesi dan Geometri - UPN Veteran Yogyakarta" />
      </div>

      {isCartOpen && <CartDrawer onClose={closeCart} />}
    </div>
  );
}
