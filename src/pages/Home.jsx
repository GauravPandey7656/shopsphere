import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Shop smarter with ShopSphere
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:mt-6 sm:text-lg">
            Discover quality products, explore different categories,
            and enjoy a simple shopping experience.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 shadow-md transition duration-200 hover:bg-gray-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 active:scale-[0.98] sm:mt-8"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Featured Products
          </h2>

          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Explore some of our popular products.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6">
            <div className="h-36 rounded-lg bg-gray-100 sm:h-40" />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Product Preview
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Product information will appear here.
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6">
            <div className="h-36 rounded-lg bg-gray-100 sm:h-40" />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Product Preview
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Product information will appear here.
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6">
            <div className="h-36 rounded-lg bg-gray-100 sm:h-40" />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Product Preview
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Product information will appear here.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Shop by Category
            </h2>

            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              Find products that match your interests.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-3 sm:gap-6">
            <button
              type="button"
              className="rounded-xl bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] sm:p-8"
            >
              <span
                className="text-4xl"
                aria-hidden="true"
              >
                💻
              </span>

              <h3 className="mt-4 text-lg font-semibold sm:text-xl">
                Electronics
              </h3>
            </button>

            <button
              type="button"
              className="rounded-xl bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] sm:p-8"
            >
              <span
                className="text-4xl"
                aria-hidden="true"
              >
                👕
              </span>

              <h3 className="mt-4 text-lg font-semibold sm:text-xl">
                Clothing
              </h3>
            </button>

            <button
              type="button"
              className="rounded-xl bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] sm:p-8"
            >
              <span
                className="text-4xl"
                aria-hidden="true"
              >
                🎧
              </span>

              <h3 className="mt-4 text-lg font-semibold sm:text-xl">
                Accessories
              </h3>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;