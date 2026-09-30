import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/productServices";
import { useCart } from "../context/useCart";
import { useWishlist } from "../context/useWishlist";
import { useAuth } from "../context/useAuth";
import { useReviews } from "../context/useReviews";
import LoadingSpinner from "../components/LoadingSpinner";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const {
    addReview,
    getProductReviews,
    deleteReview,
  } = useReviews();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [reviewErrors, setReviewErrors] = useState({
    rating: "",
    text: "",
  });

  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewMessageType, setReviewMessageType] = useState("");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProductById(id);
      setProduct(data);
    } catch {
      setError("Unable to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        if (!cancelled) {
          setProduct(data);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load product details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-12">
        <LoadingSpinner />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-8">
          <div className="text-4xl">⚠️</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-2 text-gray-600">
            {error || "The product you're looking for does not exist."}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={fetchProduct}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>

            <Link
              to="/products"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const wishlistActive = isInWishlist(product.id);

  const productReviews = getProductReviews(product.id);

  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce(
          (total, review) => total + review.rating,
          0
        ) / productReviews.length
      : 0;

  const currentUserName = user
    ? `${user.firstName} ${user.lastName}`
    : "";

  const hasAlreadyReviewed =
    isAuthenticated &&
    user &&
    productReviews.some(
      (review) =>
        review.userEmail === user.email ||
        (!review.userEmail &&
          review.userName === currentUserName)
    );

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const handleRatingChange = (ratingValue) => {
    setReviewRating(ratingValue);

    setReviewErrors((currentErrors) => ({
      ...currentErrors,
      rating: "",
    }));

    setReviewMessage("");
    setReviewMessageType("");
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);

    setReviewErrors((currentErrors) => ({
      ...currentErrors,
      text: "",
    }));

    setReviewMessage("");
    setReviewMessageType("");
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();

    setReviewMessage("");
    setReviewMessageType("");

    if (!isAuthenticated || !user) {
      setReviewMessage("Please log in to submit a review.");
      setReviewMessageType("error");
      return;
    }

    if (hasAlreadyReviewed) {
      setReviewMessage(
        "You have already reviewed this product."
      );
      setReviewMessageType("error");
      return;
    }

    const errors = {
      rating: "",
      text: "",
    };

    if (reviewRating === 0) {
      errors.rating = "Please select a rating.";
    }

    if (!reviewText.trim()) {
      errors.text =
        "Please write a review before submitting.";
    }

    setReviewErrors(errors);

    if (errors.rating || errors.text) {
      return;
    }

    const newReview = {
      id: Date.now(),
      productId: product.id,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      rating: reviewRating,
      text: reviewText.trim(),
      createdAt: new Date().toISOString(),
    };

    addReview(newReview);

    setReviewRating(0);
    setHoverRating(0);
    setReviewText("");

    setReviewErrors({
      rating: "",
      text: "",
    });

    setReviewMessage(
      "Your review has been submitted successfully!"
    );
    setReviewMessageType("success");
  };

  const handleDeleteReview = (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmed) {
      return;
    }

    deleteReview(reviewId);

    setReviewMessage("Your review has been deleted.");
    setReviewMessageType("success");
  };

  const renderStars = (rating, size = "text-lg") => {
    return (
      <div
        className={`flex items-center gap-0.5 ${size}`}
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={
              index < rating
                ? "text-yellow-500"
                : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 text-sm text-gray-500"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/"
            className="transition hover:text-blue-600"
          >
            Home
          </Link>

          <span>›</span>

          <Link
            to="/products"
            className="transition hover:text-blue-600"
          >
            Products
          </Link>

          <span>›</span>

          <span className="font-medium text-gray-700">
            {product.title}
          </span>
        </div>
      </nav>

      {/* Product Section */}
      <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="flex min-h-[350px] items-center justify-center overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 sm:min-h-[500px]">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="max-h-[450px] w-full object-contain transition duration-300 hover:scale-105"
          />
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {product.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.title}
          </h1>

          {product.rating && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1.5 text-sm font-semibold text-yellow-700">
                ⭐ {product.rating.toFixed(1)}
              </span>

              {product.reviews?.length > 0 && (
                <span className="text-sm text-gray-500">
                  {product.reviews.length} product reviews
                </span>
              )}
            </div>
          )}

          <p className="mt-6 text-3xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>

          {product.discountPercentage > 0 && (
            <p className="mt-2 text-sm font-semibold text-green-600">
              {Math.round(product.discountPercentage)}% OFF
            </p>
          )}

          <p className="mt-6 leading-7 text-gray-600">
            {product.description}
          </p>

          {product.stock !== undefined && (
            <div
              className={`mt-6 inline-flex w-fit items-center rounded-full px-3 py-1.5 text-sm font-semibold ${
                product.stock > 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} items in stock`
                : "Out of stock"}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="min-h-12 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              🛒 Add to Cart
            </button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-pressed={wishlistActive}
              className={`min-h-12 rounded-lg border px-5 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                wishlistActive
                  ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-red-600"
              }`}
            >
              {wishlistActive
                ? "❤️ Remove from Wishlist"
                : "♡ Add to Wishlist"}
            </button>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* Rating Summary */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>

            <div className="mt-5 rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200">
              <p className="text-4xl font-bold text-gray-900">
                {productReviews.length > 0
                  ? averageRating.toFixed(1)
                  : "0.0"}
              </p>

              <div className="mt-2">
                {renderStars(
                  Math.round(averageRating),
                  "text-xl"
                )}
              </div>

              <p className="mt-3 text-sm text-gray-500">
                {productReviews.length}{" "}
                {productReviews.length === 1
                  ? "customer review"
                  : "customer reviews"}
              </p>
            </div>
          </div>

          {/* Review Content */}
          <div>
            {/* Review Form */}
            {isAuthenticated && !hasAlreadyReviewed && (
              <form
                onSubmit={handleSubmitReview}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Write a Review
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Share your experience with this product.
                </p>

                {/* Rating */}
                <div className="mt-6">
                  <label className="text-sm font-semibold text-gray-700">
                    Your Rating
                  </label>

                  <div
                    className="mt-2 flex items-center gap-1"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {Array.from({ length: 5 }).map(
                      (_, index) => {
                        const ratingValue = index + 1;

                        const displayedRating =
                          hoverRating || reviewRating;

                        return (
                          <button
                            key={ratingValue}
                            type="button"
                            onClick={() =>
                              handleRatingChange(
                                ratingValue
                              )
                            }
                            onMouseEnter={() =>
                              setHoverRating(
                                ratingValue
                              )
                            }
                            aria-label={`Rate ${ratingValue} out of 5`}
                            aria-pressed={
                              reviewRating ===
                              ratingValue
                            }
                            className="rounded-md p-0.5 text-3xl transition duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                          >
                            <span
                              className={
                                ratingValue <=
                                displayedRating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }
                            >
                              ★
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>

                  {reviewErrors.rating && (
                    <p
                      className="mt-2 text-sm font-medium text-red-600"
                      role="alert"
                    >
                      ⚠️ {reviewErrors.rating}
                    </p>
                  )}

                  {reviewRating > 0 &&
                    !reviewErrors.rating && (
                      <p className="mt-2 text-sm text-gray-500">
                        You selected {reviewRating} out of 5
                        stars.
                      </p>
                    )}
                </div>

                {/* Review Text */}
                <div className="mt-5">
                  <label
                    htmlFor="review"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Your Review
                  </label>

                  <textarea
                    id="review"
                    value={reviewText}
                    onChange={handleReviewTextChange}
                    rows="5"
                    placeholder="Tell other customers about your experience..."
                    aria-invalid={Boolean(
                      reviewErrors.text
                    )}
                    aria-describedby={
                      reviewErrors.text
                        ? "review-error"
                        : undefined
                    }
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                      reviewErrors.text
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />

                  <div className="mt-2 flex items-start justify-between gap-4">
                    {reviewErrors.text ? (
                      <p
                        id="review-error"
                        className="text-sm font-medium text-red-600"
                        role="alert"
                      >
                        ⚠️ {reviewErrors.text}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Please write an honest review about
                        this product.
                      </p>
                    )}

                    <span className="shrink-0 text-xs text-gray-500">
                      {reviewText.length} characters
                    </span>
                  </div>
                </div>

                {/* Message */}
                {reviewMessage && (
                  <div
                    className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                      reviewMessageType === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                    role="alert"
                  >
                    {reviewMessageType === "success"
                      ? "✓"
                      : "⚠️"}{" "}
                    {reviewMessage}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={
                    reviewRating === 0 ||
                    !reviewText.trim()
                  }
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none sm:w-auto"
                >
                  Submit Review
                </button>
              </form>
            )}

            {/* Not Logged In */}
            {!isAuthenticated && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Want to leave a review?
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      Log in to share your experience with
                      this product.
                    </p>
                  </div>

                  <Link
                    to="/login"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Log In
                  </Link>
                </div>
              </div>
            )}

            {/* Already Reviewed */}
            {isAuthenticated && hasAlreadyReviewed && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
                <div className="flex items-start gap-3">
                  <span className="text-xl">✓</span>

                  <div>
                    <h3 className="font-bold text-green-800">
                      You've already reviewed this product
                    </h3>

                    <p className="mt-1 text-sm text-green-700">
                      You can delete your existing review
                      below if you want to submit a new one.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Review Message After Delete */}
            {reviewMessage &&
              reviewMessageType === "success" &&
              hasAlreadyReviewed === false && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  ✓ {reviewMessage}
                </div>
              )}

            {/* Reviews List */}
            <div className="mt-8 space-y-4">
              {productReviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <div className="text-3xl">💬</div>

                  <h3 className="mt-3 font-bold text-gray-900">
                    No reviews yet
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Be the first customer to review this
                    product.
                  </p>
                </div>
              ) : (
                productReviews.map((review) => {
                  const isOwnReview =
                    isAuthenticated &&
                    user &&
                    (review.userEmail === user.email ||
                      (!review.userEmail &&
                        review.userName ===
                          `${user.firstName} ${user.lastName}`));

                  return (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {review.userName
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0">
                            <h4 className="truncate font-semibold text-gray-900">
                              {review.userName}
                            </h4>

                            <p className="text-xs text-gray-500">
                              {new Date(
                                review.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {isOwnReview && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteReview(
                                review.id
                              )
                            }
                            className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      <div className="mt-4">
                        {renderStars(review.rating)}
                      </div>

                      <p className="mt-3 leading-7 text-gray-600">
                        {review.text}
                      </p>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;