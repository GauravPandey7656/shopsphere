import { Link } from "react-router-dom";
import { useOrders } from "../context/useOrders";
import { useAuth } from "../context/useAuth";

function Orders() {
  const { orders } = useOrders();
  const { user } = useAuth();

  const currentUserEmail =
    user?.email?.trim().toLowerCase() || "";

  const userOrders = orders.filter((order) => {
    const orderUserEmail =
      order.userEmail?.trim().toLowerCase() || "";

    return (
      orderUserEmail &&
      orderUserEmail === currentUserEmail
    );
  });

  const getPaymentMethodName = (paymentMethod) => {
    if (paymentMethod === "card") {
      return "Credit / Debit Card";
    }

    if (paymentMethod === "upi") {
      return "UPI";
    }

    if (paymentMethod === "cod") {
      return "Cash on Delivery";
    }

    return "Not specified";
  };

  if (userOrders.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 sm:p-8">
            <div className="text-5xl sm:text-6xl">
              📦
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:mt-6 sm:text-3xl">
              No Orders Yet
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] sm:text-base"
            >
              Start Shopping
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
          My Orders
        </h1>

        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          View your previous orders and their details.
        </p>
      </div>

      {/* Orders */}
      <div className="space-y-5 sm:space-y-6">
        {userOrders.map((order) => (
          <article
            key={order.orderId}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-200 hover:shadow-md"
          >
            {/* Order Header */}
            <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
                  Order ID
                </p>

                <p className="mt-1 break-all text-base font-bold text-blue-600 sm:text-lg">
                  {order.orderId}
                </p>
              </div>

              <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 sm:px-4 sm:py-2 sm:text-sm">
                ✓ Order Placed
              </span>
            </div>

            <div className="p-4 sm:p-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Order Date
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-900 sm:text-base">
                    {order.date || "Not available"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Payment Method
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-900 sm:text-base">
                    {getPaymentMethodName(
                      order.paymentMethod
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Items
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-900 sm:text-base">
                    {order.itemCount}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    Total
                  </p>

                  <p className="mt-2 text-lg font-bold text-blue-700 sm:text-xl">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Customer + Delivery */}
              <div className="mt-5 grid grid-cols-1 gap-5 border-t border-gray-200 pt-5 sm:mt-6 sm:gap-6 sm:pt-6 md:grid-cols-2">
                <section className="rounded-xl border border-gray-200 p-4 sm:p-5">
                  <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                    Customer Information
                  </h2>

                  <div className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-900">
                        Name:
                      </span>{" "}
                      {order.customerName}
                    </p>

                    <p className="break-all">
                      <span className="font-semibold text-gray-900">
                        Email:
                      </span>{" "}
                      {order.email}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-900">
                        Phone:
                      </span>{" "}
                      {order.phone}
                    </p>
                  </div>
                </section>

                <section className="rounded-xl border border-gray-200 p-4 sm:p-5">
                  <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                    Delivery Address
                  </h2>

                  <div className="mt-3 text-sm leading-6 text-gray-600">
                    <p>{order.address}</p>

                    <p>
                      {order.city}, {order.state}
                    </p>

                    <p>
                      PIN Code: {order.pinCode}
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="mt-8 text-center sm:mt-10">
        <Link
          to="/products"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-[0.98] sm:text-base"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default Orders;