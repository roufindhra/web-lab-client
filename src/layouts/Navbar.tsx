import { Link } from 'react-router-dom'
import { useAuth } from "@/contexts/AuthContext";
interface MainLayoutProps {
  headerVariant?: "light" | "landing";
}

function Navbar({ headerVariant = "light" }: MainLayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const isLanding = headerVariant === "landing";

  return (
    <header className={isLanding ? "bg-navy text-white" : "border-b bg-white"}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"> 
        <Link to="/" className="text-lg font-bold">
          Lab SGG
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="akademik"
            className={`text-sm ${isLanding ? "text-gray-200 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Pembelajaran
          </Link>
          <Link
            to="riset"
            className={`text-sm ${isLanding ? "text-gray-200 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Riset
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`text-sm ${isLanding ? "text-gray-200 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              >
                Dashboard
              </Link>
              {/* <Link 
                to="akademik"
                className={`text-sm ${isLanding ? "text-gray-200 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                Pembelajaran
              </Link>
              <Link
                to="riset"
                className={`text-sm ${isLanding ? "text-gray-200 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                Riset
              </Link> */}
              <Link
                to="/alat"
                className={`text-sm ${isLanding ? "text-gray-200 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              >
                Peminjaman Alat
              </Link>

              <span
                className={`text-sm ${isLanding ? "text-gray-300" : "text-gray-500"}`}
              >
                {user?.nama}
              </span>
              <button
                onClick={() => void logout()}
                className={`rounded-md px-3 py-1.5 text-sm text-white transition ${
                  isLanding
                    ? "bg-accent-orange hover:brightness-110"
                    : "bg-gray-900 hover:bg-gray-700"
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/?login=1"
              className={`rounded-md px-3 py-1.5 text-sm text-white transition ${
                isLanding
                  ? "bg-accent-orange hover:brightness-110"
                  : "bg-gray-900 hover:bg-gray-700"
              }`}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
