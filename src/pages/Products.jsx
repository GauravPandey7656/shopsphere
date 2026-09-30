import { useEffect, useState } from "react";
import { getProducts } from "../services/productServices";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();
      setProducts(data);
    } catch {
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (!cancelled) {
          setProducts(data);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setPriceRange("all");
    setSortBy("default");
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || product.category === category;

      const price = product.price;

      let matchesPrice = true;

      if (priceRange === "under50") {
        matchesPrice = price < 50;
      } else if (priceRange === "50to100") {
        matchesPrice = price >= 50 && price <= 100;
      } else if (priceRange === "over100") {
        matchesPrice = price > 100;
      }

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "priceLow") {
        return a.price - b.price;
      }

      if (sortBy === "priceHigh") {
        return b.price - a.price;
      }

      if (sortBy === "nameAZ") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "nameZA") {
        return b.title.localeCompare(a.title);
      }

      return 0;
    });

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div
          className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 sm:p-8"
          role="alert"
        >
          <div className="text-5xl" aria-hidden="true">
            ⚠️
          </div>

          <h1 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
            Unable to Load Products
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-500 sm:text-base">
            {error}
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Please try again.
          </p>

          <button
            type="button"
            onClick={loadProducts}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          All Products
        </h1>

        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Find the products you are looking for.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:mb-10 sm:p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
            Find Products
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Search, filter, and sort products.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
          >
            <option value="all">All Categories</option>
            <option value="beauty">Beauty</option>
            <option value="fragrances">Fragrances</option>
            <option value="furniture">Furniture</option>
            <option value="groceries">Groceries</option>
            <option value="home-decoration">
              Home Decoration
            </option>
            <option value="kitchen-accessories">
              Kitchen Accessories
            </option>
            <option value="laptops">Laptops</option>
            <option value="mens-shirts">Men's Shirts</option>
            <option value="mens-shoes">Men's Shoes</option>
            <option value="mens-watches">Men's Watches</option>
            <option value="mobile-accessories">
              Mobile Accessories
            </option>
            <option value="motorcycle">Motorcycle</option>
            <option value="skin-care">Skin Care</option>
            <option value="smartphones">Smartphones</option>
            <option value="sports-accessories">
              Sports Accessories
            </option>
            <option value="sunglasses">Sunglasses</option>
            <option value="tablets">Tablets</option>
            <option value="tops">Tops</option>
            <option value="vehicle">Vehicle</option>
            <option value="womens-bags">Women's Bags</option>
            <option value="womens-dresses">
              Women's Dresses
            </option>
            <option value="womens-jewellery">
              Women's Jewellery
            </option>
            <option value="womens-shoes">Women's Shoes</option>
            <option value="womens-watches">Women's Watches</option>
          </select>

          {/* Price */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            aria-label="Filter by price"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
          >
            <option value="all">All Prices</option>
            <option value="under50">Under $50</option>
            <option value="50to100">$50 - $100</option>
            <option value="over100">Over $100</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
          >
            <option value="default">Sort By</option>
            <option value="priceLow">
              Price: Low to High
            </option>
            <option value="priceHigh">
              Price: High to Low
            </option>
            <option value="nameAZ">Name: A to Z</option>
            <option value="nameZA">Name: Z to A</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            ✕ Clear Filters
          </button>
        </div>
      </div>

      {/* Result Count */}
      <div className="mb-5 flex items-center justify-between sm:mb-6">
        <p className="text-sm text-gray-600 sm:text-base">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredProducts.length}
          </span>{" "}
          products
        </p>
      </div>

      {/* No Results / Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 sm:p-8">
            <div className="text-5xl" aria-hidden="true">
              🔍
            </div>

            <p className="mt-4 text-lg font-semibold text-gray-700 sm:text-xl">
              No products found
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Products;