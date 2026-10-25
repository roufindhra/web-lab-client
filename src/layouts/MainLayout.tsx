// import { Link, Outlet } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import Footer from "./Footer";

// export default function MainLayout() {
//   const { isAuthenticated, user, logout } = useAuth();

//   return (
//     <div className="flex min-h-screen flex-col">
//       <header className="border-b bg-white">
//         <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
//           <Link to="/" className="text-lg font-bold">
//             Lab SGG
//           </Link>
//           <nav className="flex items-center gap-4">
//             {isAuthenticated ? (
//               <>
//                 <Link
//                   to="/dashboard"
//                   className="text-sm text-gray-600 hover:text-gray-900"
//                 >
//                   Dashboard
//                 </Link>
//                 <span className="text-sm text-gray-500">{user?.nama}</span>
//                 <button
//                   onClick={() => void logout()}
//                   className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <Link
//                 to="/auth/login"
//                 className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
//               >
//                 Login
//               </Link>
//             )}
//           </nav>
//         </div>
//       </header>
//       <main className="flex-1">
//         <Outlet />
//       </main>
//       <Footer companyName="Lab Survei Geodesi dan Geometri - UPN Veteran Yogyakarta" />
//     </div>
//   );
// }

//test hasil tampilan di main

import React, { useState } from "react";
import { Link, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import Footer from "./Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { label: "Beranda", path: "/" },
    { label: "Dashboard", path: "/dashboard", authRequired: true },
    { label: "Peminjaman Alat", path: "/peminjaman", authRequired: true },
    { label: "Design System Test", path: "/test", authRequired: false },
  ];

  const visibleMenuItems = menuItems.filter(
    (item) => !item.authRequired || isAuthenticated,
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-surface px-4 shadow-xs md:px-6">
        <div className="flex items-center gap-3">
          {/* Toggle Sidebar Mobile */}
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="rounded-md p-2 text-surface-text hover:bg-surface-container focus:outline-none lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2">
            {/* <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-lg text-white">
              S
            </div> */}
            <div>
              <h1 className="text-sm font-bold text-surface-text leading-tight">
                Laboratorium Survei Geodesi dan Geometri
              </h1>
              <p className="hidden text-[10px] text-gray-500 sm:block">
                Universitas Pembangunan Nasional "Veteran" Yogyakarta
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-surface-text">
                  {user?.nama}
                </p>
                <p className="text-[10px] capitalize text-gray-500">
                  {user?.role || "User"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => void logout()}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/auth/login">
              <Button variant="primary" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* --- SIDEBAR --- */}
        <aside
          className={cn(
            "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-surface-container transition-transform duration-200 lg:static lg:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* Header Mobile Sidebar */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 lg:hidden">
            <span className="text-sm font-bold text-surface-text">
              Menu Utama
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
            {visibleMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-surface-text hover:bg-surface-accent/60",
                  )
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex flex-1 flex-col p-4 md:p-6 overflow-x-hidden">
          <Breadcrumb />
          <div className="flex-1">
            <Outlet />
          </div>
          <div className="mt-8 border-t pt-4">
            <Footer companyName="Laboratorium Survei Geodesi dan Geometri - UPN Veteran Yogyakarta" />
          </div>
        </main>
      </div>
    </div>
  );
}
