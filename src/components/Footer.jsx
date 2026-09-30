import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-block text-2xl font-bold tracking-tight text-white transition hover:text-blue-400"
            >
              ShopSphere
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              A modern e-commerce experience built with React,
              Tailwind CSS, and a real product API.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/"
                className="w-fit text-sm transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="w-fit text-sm transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Products
              </Link>

              <Link
                to="/wishlist"
                className="w-fit text-sm transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Wishlist
              </Link>

              <Link
                to="/cart"
                className="w-fit text-sm transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cart
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Account
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/login"
                className="w-fit text-sm transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="w-fit text-sm transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign Up
              </Link>

              <Link
                to="/profile"
                className="w-fit text-sm transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                My Account
              </Link>

              <Link
                to="/orders"
                className="w-fit text-sm transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                My Orders
              </Link>
            </div>
          </div>

          {/* Project Information */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              ShopSphere
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Built as a frontend e-commerce portfolio project
              with responsive design and modern React patterns.
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              <span>⚡</span>
              <span>Built with React + Tailwind CSS</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-gray-800 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-gray-500 sm:text-sm">
            © {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>

          <p className="text-xs text-gray-500 sm:text-sm">
            Built for learning and portfolio purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;