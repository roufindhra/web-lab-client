import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  customMap?: Record<string, string>;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  customMap = {
    dashboard: "Dashboard",
    peminjaman: "Peminjaman Alat",
    praktikum: "Jadwal Praktikum",
    test: "Design System Test",
    auth: "Autentikasi",
    login: "Masuk",
  },
}) => {
  const location = useLocation();

  const autoItems: BreadcrumbItem[] = React.useMemo(() => {
    if (items) return items;

    const pathnames = location.pathname.split("/").filter((x) => x);
    const generated: BreadcrumbItem[] = [{ label: "Beranda", path: "/" }];

    let currentPath = "";
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      const isLast = index === pathnames.length - 1;

      const formattedLabel =
        customMap[name.toLowerCase()] ||
        name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");

      generated.push({
        label: formattedLabel,
        path: isLast ? undefined : currentPath,
      });
    });

    return generated;
  }, [items, location.pathname, customMap]);

  if (autoItems.length <= 1 && location.pathname === "/") {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs text-gray-500 mb-4", className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {autoItems.map((item, index) => {
          const isLast = index === autoItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <svg
                  className="h-3.5 w-3.5 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}

              {isLast || !item.path ? (
                <span className="font-semibold text-surface-text select-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-primary transition-colors hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
