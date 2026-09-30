import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 sm:p-8">
            <div className="text-5xl sm:text-6xl">🛒</div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:mt-6 sm:text-3xl">
              Your Cart is Empty
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] sm:px-6 sm:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Review the products in your cart.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition duration-200 hover:bg-red-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 active:scale-[0.98] sm:w-auto"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => {
            const productImage =
              item.thumbnail ||
              item.images?.[0] ||
              "https://via.placeholder.com/400x400?text=No+Image";

            const hasStockLimit =
              typeof item.stock === "number" &&
              Number.isFinite(item.stock) &&
              item.stock > 0;

            const isMaxQuantityReached =
              hasStockLimit &&
              item.quantity >= item.stock;

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition duration-200 hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  {/* Product Image */}
                  <Link
                    to={`/products/${item.id}`}
                    className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-5 sm:h-32 sm:w-32 sm:p-4"
                    aria-label={`View ${item.title}`}
                  >
                    <img
                      src={productImage}
                      alt={item.title}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://via.placeholder.com/400x400?text=No+Image";
                      }}
                      className="h-full w-full object-contain transition duration-300 hover:scale-105"
                    />
                  </Link>

                  {/* Product Information */}
                  <div className="min-w-0 flex-1">
                    <Link to={`/products/${item.id}`}>
                      <h2 className="line-clamp-2 text-base font-semibold leading-6 text-gray-900 transition hover:text-blue-600 sm:text-lg">
                        {item.title}
                      </h2>
                    </Link>

                    <p className="mt-2 text-lg font-bold text-blue-600 sm:text-xl">
                      ${Number(item.price).toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium text-gray-600">
                        Quantity:
                      </span>

                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
                        {/* Decrease */}
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="flex min-h-10 min-w-10 items-center justify-center text-lg font-semibold text-gray-700 transition duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 active:bg-gray-200"
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          −
                        </button>

                        {/* Quantity */}
                        <span
                          className="flex min-h-10 min-w-10 items-center justify-center border-x border-gray-300 px-3 text-sm font-semibold text-gray-900"
                          aria-label={`Quantity ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>

                        {/* Increase */}
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          disabled={isMaxQuantityReached}
                          className="flex min-h-10 min-w-10 items-center justify-center text-lg font-semibold text-gray-700 transition duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 active:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-gray-100"
                          aria-label={
                            isMaxQuantityReached
                              ? `Maximum available quantity reached for ${item.title}`
                              : `Increase quantity of ${item.title}`
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* Stock Information */}
                      {hasStockLimit && (
                        <span
                          className={`text-xs font-medium ${
                            isMaxQuantityReached
                              ? "text-orange-600"
                              : "text-gray-500"
                          }`}
                        >
                          {isMaxQuantityReached
                            ? `Maximum ${item.stock} available`
                            : `${item.stock} available`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Item Total + Remove */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                    <p className="text-lg font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition duration-200 hover:bg-red-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 active:scale-[0.98]"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Cart Summary */}
        <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:p-6 lg:sticky lg:top-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Order Summary
          </h2>

          <div className="mt-5 space-y-4 sm:mt-6">
            <div className="flex justify-between text-sm text-gray-600 sm:text-base">
              <span>Subtotal</span>

              <span className="font-medium text-gray-900">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-600 sm:text-base">
              <span>Shipping</span>

              <span className="font-semibold text-green-600">
                Free
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-lg font-bold text-gray-900 sm:text-xl">
                <span>Total</span>

                <span className="text-blue-600">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Link
            to="/checkout"
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] sm:text-base"
          >
            Proceed to Checkout
          </Link>

          {/* Continue Shopping */}
          <Link
            to="/products"
            className="mt-3 flex min-h-12 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm transition duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-[0.98] sm:text-base"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;