import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import { AuthProvider } from "./context/AuthProvider";
import { OrderProvider } from "./context/OrderProvider";
import { ReviewProvider } from "./context/ReviewProvider";
import { WishlistProvider } from "./context/WishlistProvider";
import { CartProvider } from "./context/CartProvider";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <ReviewProvider>
          <WishlistProvider>
            <CartProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-gray-50">
                  <Navbar />

                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />

                    <Route
                      path="/products"
                      element={<Products />}
                    />

                    <Route
                      path="/products/:id"
                      element={<ProductDetails />}
                    />

                    <Route
                      path="/cart"
                      element={<Cart />}
                    />

                    <Route
                      path="/wishlist"
                      element={<Wishlist />}
                    />

                    {/* Protected Routes */}
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    {/* Authentication Routes */}
                    <Route
                      path="/signup"
                      element={
                        <PublicRoute>
                          <Signup />
                        </PublicRoute>
                      }
                    />

                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />

                    {/* Fallback Route */}
                    <Route
                      path="*"
                      element={<Navigate to="/" replace />}
                    />
                  </Routes>

                  <Footer />
                </div>
              </BrowserRouter>
            </CartProvider>
          </WishlistProvider>
        </ReviewProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;