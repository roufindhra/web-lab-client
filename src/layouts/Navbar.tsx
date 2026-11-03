import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { cn } from "../utils/cn";

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface NavbarProps {
  items: NavItem[];
  onLogout?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
  user?: {
    name: string;
    role: string;
  };
}

const ActiveLink: React.FC<
  NavItem & { onNavigate?: () => void }
> = ({ label, path, onNavigate }) => {
  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium",
          isActive
            ? "text-primary font-bold underline underline-offset-4 decoration-primary decoration-2"
            : "text-primary font-semibold hover:bg-surface-container"
        )
      }
    >
      {label}
    </NavLink>
  );
};

export const Navbar: React.FC<NavbarProps> = ({
  items,
  onLogout,
  cartCount = 0,
  onOpenCart,
  user,
}) => {
  const [open, setOpen] = useState(false);

  const closeMobileMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-surface shadow-xs">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          {items.map((item) => (
            <ActiveLink key={item.path} {...item} />
          ))}
        </div>

        {/* Menu desktop */}
        <div className="hidden items-center gap-1 lg:flex">
          

          <div className="ml-2 flex items-center gap-3 border-l border-gray-200 pl-3">
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative rounded-md p-2 text-surface-text hover:bg-surface-container focus:outline-none"
                aria-label="Buka keranjang"
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
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-semibold text-surface-text">
                    {user.name}
                  </p>
                  <p className="text-[10px] capitalize text-gray-500">
                    {user.role}
                  </p>
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
              </>
            ) : (
              <Link to="/?login=1">
                <Button variant="primary" size="sm">
                  Masuk
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Tombol kanan mobile: keranjang + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative rounded-md p-2 text-surface-text hover:bg-surface-container focus:outline-none"
              aria-label="Buka keranjang"
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
          {user && (
            <Link to="/akun" className="lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-accent text-xs font-semibold text-primary">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
            </Link>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-surface-text hover:bg-surface-container focus:outline-none"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Menu mobile (dropdown) */}
      {open && (
        <div className="border-t border-gray-200 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pt-2 pb-4 md:px-6">
            {items.map((item) => (
              <ActiveLink key={item.path} {...item} onNavigate={closeMobileMenu} />
            ))}

            <div className="mt-2 flex items-center gap-3 border-t border-gray-200 pt-3">
              {user ? (
                <>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-accent text-xs font-semibold text-primary">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-surface-text">
                      {user.name}
                    </p>
                    <p className="text-[10px] capitalize text-gray-500">
                      {user.role}
                    </p>
                  </div>
                  {onLogout && (
                    <Button variant="outline" size="sm" onClick={onLogout}>
                      Logout
                    </Button>
                  )}
                </>
              ) : (
                <Link to="/?login=1" onClick={closeMobileMenu}>
                  <Button variant="primary" size="sm">
                    Masuk
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
