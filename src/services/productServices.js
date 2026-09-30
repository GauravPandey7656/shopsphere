const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://dummyjson.com/products";

const FALLBACK_PRODUCT_IMAGE =
  "https://via.placeholder.com/400x400?text=No+Image";

const handleResponse = async (response, defaultMessage) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    // Response did not contain valid JSON.
  }

  if (!response.ok) {
    const message =
      data?.message ||
      `${defaultMessage} (HTTP ${response.status})`;

    throw new Error(message);
  }

  if (!data) {
    throw new Error(`${defaultMessage}: Empty response.`);
  }

  return data;
};

const normalizeProduct = (product) => {
  if (!product || typeof product !== "object") {
    return null;
  }

  const id = Number(product.id);

  const title =
    typeof product.title === "string"
      ? product.title.trim()
      : "";

  const price = Number(product.price);

  if (
    !Number.isFinite(id) ||
    id <= 0 ||
    !title ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    return null;
  }

  const normalizedProduct = {
    ...product,
    id,
    title,
    price,
    description:
      typeof product.description === "string"
        ? product.description
        : "",
    category:
      typeof product.category === "string"
        ? product.category
        : "",
    thumbnail:
      typeof product.thumbnail === "string" &&
      product.thumbnail.trim()
        ? product.thumbnail
        : FALLBACK_PRODUCT_IMAGE,
    images: Array.isArray(product.images)
      ? product.images
      : [],
    rating:
      typeof product.rating === "number" &&
      Number.isFinite(product.rating)
        ? product.rating
        : null,
    stock:
      typeof product.stock === "number" &&
      Number.isFinite(product.stock)
        ? product.stock
        : null,
    discountPercentage:
      typeof product.discountPercentage === "number" &&
      Number.isFinite(product.discountPercentage)
        ? product.discountPercentage
        : 0,
  };

  return normalizedProduct;
};

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}?limit=0`);

    const data = await handleResponse(
      response,
      "Failed to fetch products"
    );

    if (!Array.isArray(data.products)) {
      throw new Error(
        "Invalid product data received from the API."
      );
    }

    return data.products
      .map(normalizeProduct)
      .filter(Boolean);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the product service. Please check your internet connection.",
        { cause: error }
      );
    }

    throw error;
  }
};

export const getProductById = async (id) => {
  const numericId = Number(id);

  if (!Number.isFinite(numericId) || numericId <= 0) {
    throw new Error("Invalid product ID.");
  }

  try {
    const response = await fetch(`${API_URL}/${numericId}`);

    const data = await handleResponse(
      response,
      "Failed to fetch product"
    );

    const normalizedProduct =
      normalizeProduct(data);

    if (!normalizedProduct) {
      throw new Error(
        "Invalid product data received from the API."
      );
    }

    return normalizedProduct;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the product service. Please check your internet connection.",
        { cause: error }
      );
    }

    throw error;
  }
};