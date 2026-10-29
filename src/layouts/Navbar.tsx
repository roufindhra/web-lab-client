import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

interface NavbarProps {
  onToggleSidebar?: () => void;
  onLogout?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
  user?: {
    name: string;
    role: string;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onLogout,
  cartCount = 0,
  onOpenCart,
  user,
}) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-surface px-4 shadow-xs md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-md p-2 text-surface-text hover:bg-surface-container focus:outline-none lg:hidden"
          aria-label="Open Sidebar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
            S
          </div>
          <div>
            <h1 className="text-sm font-bold text-surface-text leading-tight">Lab SGG</h1>
            <p className="text-[10px] text-gray-500 hidden sm:block">Surveying & Geodesy Group</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onOpenCart && (
          <button
            onClick={onOpenCart}
            className="relative rounded-md p-2 text-surface-text hover:bg-surface-container focus:outline-none"
            aria-label="Buka keranjang"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        )}
        {user ? (
          <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-surface-text">{user.name}</p>
              <p className="text-[10px] capitalize text-gray-500">{user.role}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-accent font-semibold text-xs text-primary">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <Link to="/akun">
              <Button variant="outline" size="sm">
                Akun
              </Button>
            </Link>
            {onLogout && (
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            )}
          </div>
        ) : (
          <Link to="/?login=1">
            <Button variant="primary" size="sm">Masuk</Button>
          </Link>
        )}
      </div>
    </header>
  );
};
