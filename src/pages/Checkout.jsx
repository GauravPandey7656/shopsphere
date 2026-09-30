import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../context/useOrders";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [formError, setFormError] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFormError("");
  };

  const generateOrderId = () => {
    const randomNumber = Math.floor(
      100000 + Math.random() * 900000
    );

    return `SS-${randomNumber}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormError("");

    if (!paymentMethod) {
      setPaymentError("Please select a payment method.");
      return;
    }

    setPaymentError("");

    const phoneRegex = /^[0-9]{10}$/;
    const pinCodeRegex = /^[0-9]{6}$/;

    if (!phoneRegex.test(formData.phone)) {
      setFormError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!pinCodeRegex.test(formData.pinCode)) {
      setFormError("Please enter a valid 6-digit PIN code.");
      return;
    }

    /*
     * Create a clean snapshot of the cart items.
     * These items are saved inside the order so the
     * order history contains the products purchased.
     */
    const orderItems = cartItems.map((item) => ({
      id: Number(item.id),
      title: item.title,
      price: Number(item.price),
      quantity: Number(item.quantity),
      thumbnail: item.thumbnail || "",
      images: Array.isArray(item.images)
        ? item.images
        : [],
    }));

    /*
     * Create the order.
     *
     * userEmail connects this order to the currently
     * logged-in user.
     */
    const newOrder = {
      orderId: generateOrderId(),

      userEmail:
        user?.email?.trim().toLowerCase() || "",

      customerName: `${formData.firstName} ${formData.lastName}`,

      email: formData.email,

      phone: formData.phone,

      address: formData.address,

      city: formData.city,

      state: formData.state,

      pinCode: formData.pinCode,

      paymentMethod,

      items: orderItems,

      itemCount: orderItems.reduce(
        (total, item) => total + item.quantity,
        0
      ),

      total: Number(cartTotal),

      status: "Confirmed",

      createdAt: new Date().toISOString(),

      date: new Date().toLocaleString(),
    };

    /*
     * addOrder() returns false if the order is invalid.
     * Do not show success or clear the cart in that case.
     */
    const orderSaved = addOrder(newOrder);

    if (!orderSaved) {
      setFormError(
        "Unable to place your order. Please try again."
      );
      return;
    }

    setOrderDetails(newOrder);
    setOrderPlaced(true);
    clearCart();
  };

  const getPaymentMethodName = () => {
    if (orderDetails?.paymentMethod === "card") {
      return "Credit / Debit Card";
    }

    if (orderDetails?.paymentMethod === "upi") {
      return "UPI";
    }

    if (orderDetails?.paymentMethod === "cod") {
      return "Cash on Delivery";
    }

    return "Not selected";
  };

  /*
   * Order confirmation screen
   */
  if (orderPlaced && orderDetails) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200 sm:p-8 lg:p-10">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-4xl shadow-sm sm:h-20 sm:w-20 sm:text-5xl">
                ✅
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Order Placed Successfully!
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
                Thank you for shopping with ShopSphere. Your order
                has been received successfully.
              </p>
            </div>

            {/* Order Details */}
            <div className="mt-6 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200 sm:mt-8 sm:p-6">
              <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-gray-600 sm:text-base">
                  Order ID
                </span>

                <span className="font-bold text-blue-600">
                  {orderDetails.orderId}
                </span>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <span className="text-sm text-gray-600 sm:text-base">
                    Customer
                  </span>

                  <span className="font-medium text-gray-900 sm:text-right">
                    {orderDetails.customerName}
                  </span>
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <span className="text-sm text-gray-600 sm:text-base">
                    Email
                  </span>

                  <span className="break-all font-medium text-gray-900 sm:text-right">
                    {orderDetails.email}
                  </span>
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <span className="text-sm text-gray-600 sm:text-base">
                    Payment
                  </span>

                  <span className="font-medium text-gray-900 sm:text-right">
                    {getPaymentMethodName()}
                  </span>
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <span className="text-sm text-gray-600 sm:text-base">
                    Items
                  </span>

                  <span className="font-medium text-gray-900 sm:text-right">
                    {orderDetails.itemCount}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-t border-gray-200 pt-4">
                  <span className="text-base font-semibold text-gray-900 sm:text-lg">
                    Total
                  </span>

                  <span className="text-base font-bold text-blue-600 sm:text-lg">
                    ${Number(orderDetails.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 sm:mt-6 sm:p-6">
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                📦 Delivery Address
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
                {orderDetails.address}
                <br />
                {orderDetails.city}, {orderDetails.state}
                <br />
                PIN Code: {orderDetails.pinCode}
                <br />
                Phone: {orderDetails.phone}
              </p>
            </div>

            {/* Confirmation Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center">
              <Link
                to="/products"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] sm:text-base"
              >
                Continue Shopping
              </Link>

              <Link
                to="/"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm transition duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-[0.98] sm:text-base"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Empty cart
   */
  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 sm:p-8">
            <div className="text-5xl sm:text-6xl">
              🛒
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:mt-6 sm:text-3xl">
              Your Cart is Empty
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              Add some products before proceeding to checkout.
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
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Enter your details to complete your order.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left Section */}
          <section className="space-y-6 lg:col-span-2 lg:space-y-8">
            {/* Delivery Information */}
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
              <div className="border-b border-gray-100 pb-4 sm:pb-5">
                <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  Delivery Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the details where your order should be delivered.
                </p>
              </div>

              <div className="mt-5 space-y-5 sm:mt-6">
                {/* Name */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      required
                      className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      required
                      className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength="10"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    required
                    className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter your full address"
                    required
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                      className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      State
                    </label>

                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                      className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pinCode"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      PIN Code
                    </label>

                    <input
                      id="pinCode"
                      type="text"
                      inputMode="numeric"
                      maxLength="6"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="6-digit PIN"
                      required
                      className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                    />
                  </div>
                </div>

                {/* Form Validation Error */}
                {formError && (
                  <p
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                    role="alert"
                  >
                    ⚠️ {formError}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
              <div className="border-b border-gray-100 pb-4 sm:pb-5">
                <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  Payment Method
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select your preferred payment option.
                </p>
              </div>

              <div className="mt-5 space-y-3 sm:mt-6">
                {/* Card */}
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 shadow-sm transition duration-200 focus-within:ring-2 focus-within:ring-blue-200 ${
                    paymentMethod === "card"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentError("");
                    }}
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      💳 Credit / Debit Card
                    </p>

                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      Pay securely using your card.
                    </p>
                  </div>
                </label>

                {/* UPI */}
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 shadow-sm transition duration-200 focus-within:ring-2 focus-within:ring-blue-200 ${
                    paymentMethod === "upi"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentError("");
                    }}
                    className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      📱 UPI
                    </p>

                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      Pay using your UPI ID.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 shadow-sm transition duration-200 focus-within:ring-2 focus-within:ring-blue-200 ${
                    paymentMethod === "cod"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentError("");
                    }}
                    className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      💵 Cash on Delivery
                    </p>

                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                {/* Payment Validation Error */}
                {paymentError && (
                  <p
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                    role="alert"
                  >
                    ⚠️ {paymentError}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Order Summary */}
          <aside>
            <div className="h-fit rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                Order Summary
              </h2>

              <div className="mt-5 space-y-4 sm:mt-6">
                {cartItems.map((item) => {
                  const productImage =
                    item.thumbnail ||
                    item.images?.[0] ||
                    "https://via.placeholder.com/400x400?text=No+Image";

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 border-b border-gray-100 pb-4"
                    >
                      <img
                        src={productImage}
                        alt={item.title}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src =
                            "https://via.placeholder.com/400x400?text=No+Image";
                        }}
                        className="h-14 w-14 shrink-0 rounded-xl bg-gray-50 object-contain p-2 sm:h-16 sm:w-16"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-medium leading-5 text-gray-900">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                          Qty: {item.quantity}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900 sm:text-base">
                          $
                          {(
                            item.price * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 space-y-3 border-t border-gray-200 pt-5 sm:mt-6 sm:pt-6">
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

                <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-900 sm:text-xl">
                  <span>Total</span>

                  <span className="text-blue-600">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] sm:text-base"
              >
                Place Order
              </button>

              <Link
                to="/cart"
                className="mt-3 flex min-h-11 w-full items-center justify-center text-center text-sm font-semibold text-blue-600 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                ← Back to Cart
              </Link>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}

export default Checkout;