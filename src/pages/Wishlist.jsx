import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useWishlist } from "../context/useWishlist";

function Wishlist() {
  const {
    wishlistItems,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    if (!item) {
      return;
    }

    addToCart(item);
  };

  // Empty Wishlist
  if (wishlistItems.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 sm:p-8">
            <div className="text-5xl sm:text-6xl">❤️</div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:mt-6 sm:text-3xl">
              Your Wishlist is Empty
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              Save products you love and come back to them later.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] sm:px-6 sm:text-base"
            >
              Browse Products
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
            My Wishlist
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Products you've saved for later.
          </p>
        </div>

        <button
          type="button"
          onClick={clearWishlist}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition duration-200 hover:bg-red-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 active:scale-[0.98] sm:w-auto"
        >
          Clear Wishlist
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((item) => {
          const productImage =
            item.thumbnail ||
            item.images?.[0] ||
            "https://via.placeholder.com/400x400?text=No+Image";

          const hasStockData =
            typeof item.stock === "number" &&
            Number.isFinite(item.stock);

          const isOutOfStock =
            hasStockData && item.stock <= 0;

          return (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Product Image */}
              <Link
                to={`/products/${item.id}`}
                className="block bg-gray-50"
                aria-label={`View ${item.title}`}
              >
                <div className="flex h-64 items-center justify-center overflow-hidden p-6">
                  <img
                    src={productImage}
                    alt={item.title}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://via.placeholder.com/400x400?text=No+Image";
                    }}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Product Information */}
              <div className="p-5">
                {item.category && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {item.category}
                  </p>
                )}

                <Link to={`/products/${item.id}`}>
                  <h2 className="mt-2 min-h-[3.5rem] text-base font-bold leading-6 text-gray-900 transition hover:text-blue-600">
                    {item.title || "Untitled Product"}
                  </h2>
                </Link>

                {typeof item.rating === "number" &&
                  Number.isFinite(item.rating) && (
                    <div className="mt-3">
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                        ⭐ {item.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                <div className="mt-4">
                  {typeof item.price === "number" &&
                  Number.isFinite(item.price) ? (
                    <p className="text-xl font-bold text-gray-900">
                      ${item.price.toFixed(2)}
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-gray-500">
                      Price unavailable
                    </p>
                  )}
                </div>

                {/* Stock */}
                {hasStockData && (
                  <p
                    className={`mt-2 text-xs font-medium ${
                      isOutOfStock
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {isOutOfStock
                      ? "Out of stock"
                      : `${item.stock} in stock`}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    disabled={isOutOfStock}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
                    aria-label={
                      isOutOfStock
                        ? `${item.title} is out of stock`
                        : `Add ${item.title} to cart`
                    }
                  >
                    🛒 Add to Cart
                  </button>

                  <Link
                    to={`/products/${item.id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition duration-200 hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
                  >
                    View
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.id)}
                  className="mt-2 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition duration-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 active:scale-[0.98]"
                  aria-label={`Remove ${item.title} from wishlist`}
                >
                  ❤️ Remove from Wishlist
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default Wishlist;