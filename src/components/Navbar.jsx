import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useWishlist } from "../context/useWishlist";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      isActive(path)
        ? "bg-blue-50 text-blue-600"
        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="shrink-0 rounded-lg text-xl font-bold tracking-tight text-blue-600 transition duration-200 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-2xl"
          >
            ShopSphere
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>

            <Link
              to="/products"
              className={navLinkClass("/products")}
            >
              Products
            </Link>

            <Link
              to="/wishlist"
              className={`${navLinkClass(
                "/wishlist"
              )} relative`}
            >
              Wishlist

              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <Link
                to="/orders"
                className={navLinkClass("/orders")}
              >
                Orders
              </Link>
            )}

            {/* Authenticated User */}
            {isAuthenticated ? (
              <>
                <div className="mx-2 h-6 w-px bg-gray-200" />

                <span className="px-2 text-sm font-medium text-gray-600">
                  Hi, {user.firstName}
                </span>

                <Link
                  to="/profile"
                  className={navLinkClass("/profile")}
                >
                  Account
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="mx-2 h-6 w-px bg-gray-200" />

                <Link
                  to="/login"
                  className={navLinkClass("/login")}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="ml-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative ml-2 rounded-lg p-2 text-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isActive("/cart")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
              aria-label="Shopping cart"
            >
              🛒

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Cart */}
            <Link
              to="/cart"
              className={`relative rounded-lg p-2 text-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isActive("/cart")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Shopping cart"
            >
              🛒

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="rounded-lg p-2 text-xl text-gray-700 transition duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={navLinkClass("/")}
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMenu}
                className={navLinkClass("/products")}
              >
                Products
              </Link>

              <Link
                to="/wishlist"
                onClick={closeMenu}
                className={`${navLinkClass(
                  "/wishlist"
                )} flex items-center justify-between`}
              >
                <span>Wishlist</span>

                {wishlistItems.length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {isAuthenticated && (
                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className={navLinkClass("/orders")}
                >
                  Orders
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <div className="my-2 border-t border-gray-200" />

                  <div className="rounded-lg bg-gray-50 px-3 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Signed in as
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className={navLinkClass("/profile")}
                  >
                    Account
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition duration-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="my-2 border-t border-gray-200" />

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className={navLinkClass("/login")}
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="mt-1 rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              <Link
                to="/cart"
                onClick={closeMenu}
                className={navLinkClass("/cart")}
              >
                Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;