import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useWishlist } from "../context/useWishlist";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const wishlistActive = isInWishlist(product.id);

  const hasValidPrice =
    typeof product.price === "number" &&
    Number.isFinite(product.price);

  const hasValidRating =
    typeof product.rating === "number" &&
    Number.isFinite(product.rating);

  const hasStockData =
    typeof product.stock === "number" &&
    Number.isFinite(product.stock);

  const isOutOfStock = hasStockData && product.stock <= 0;

  const productImage =
    product.thumbnail ||
    product.images?.[0] ||
    "https://via.placeholder.com/400x400?text=No+Image";

  const handleAddToCart = () => {
    if (isOutOfStock) {
      return;
    }

    addToCart(product);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image */}
      <Link
        to={`/products/${product.id}`}
        className="block bg-gray-50"
        aria-label={`View ${product.title}`}
      >
        <div className="flex h-64 items-center justify-center overflow-hidden p-6 sm:h-72">
          <img
            src={productImage}
            alt={product.title}
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
        {/* Category */}
        {product.category && (
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {product.category}
          </p>
        )}

        {/* Title */}
        <Link to={`/products/${product.id}`}>
          <h2 className="mt-2 min-h-[3.5rem] text-base font-bold leading-6 text-gray-900 transition hover:text-blue-600">
            {product.title || "Untitled Product"}
          </h2>
        </Link>

        {/* Rating */}
        {hasValidRating && (
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
              ⭐ {product.rating.toFixed(1)}
            </span>

            {Array.isArray(product.reviews) &&
              product.reviews.length > 0 && (
                <span className="text-xs text-gray-500">
                  {product.reviews.length} reviews
                </span>
              )}
          </div>
        )}

        {/* Price */}
        <div className="mt-4 flex items-center justify-between gap-3">
          {hasValidPrice ? (
            <p className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          ) : (
            <p className="text-sm font-semibold text-gray-500">
              Price unavailable
            </p>
          )}

          {typeof product.discountPercentage === "number" &&
            product.discountPercentage > 0 && (
              <span className="text-xs font-medium text-green-600">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            )}
        </div>

        {/* Stock */}
        {hasStockData && (
          <p
            className={`mt-2 text-xs font-medium ${
              isOutOfStock ? "text-red-600" : "text-green-600"
            }`}
          >
            {isOutOfStock
              ? "Out of stock"
              : `${product.stock} in stock`}
          </p>
        )}

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            to={`/products/${product.id}`}
            aria-label={`View details for ${product.title}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            View Product
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={
              isOutOfStock
                ? `${product.title} is out of stock`
                : `Add ${product.title} to cart`
            }
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition duration-200 hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            🛒 Add
          </button>
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-pressed={wishlistActive}
          aria-label={
            wishlistActive
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          className={`mt-2 inline-flex min-h-10 w-full items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            wishlistActive
              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-red-600"
          }`}
        >
          {wishlistActive
            ? "❤️ Remove from Wishlist"
            : "♡ Add to Wishlist"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;