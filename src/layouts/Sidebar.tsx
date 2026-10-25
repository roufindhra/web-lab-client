import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../utils/cn";

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: NavItem[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-surface-container transition-transform duration-200 lg:static lg:translate-x-0",
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 lg:hidden">
          <span className="font-bold text-sm text-surface-text">Navigasi</span>
          <button
            onClick={onCloseMobile}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-surface-text hover:bg-surface-accent/60"
                )
              }
            >
              {item.icon && <span className="h-5 w-5 shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};