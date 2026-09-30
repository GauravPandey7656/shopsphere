import {
  useEffect,
  useState,
} from "react";
import { WishlistContext } from "./WishlistContext";
import { useAuth } from "./useAuth";
import { normalizeEmail } from "../utils/normalizeEmail";

const getWishlistKey = (email) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  return `shopsphere_wishlist_${normalizedEmail}`;
};

/*
  Normalize a single product before storing it in the wishlist.
  This is wishlist-specific normalization and is intentionally
  kept inside WishlistProvider.
*/
const normalizeWishlistProduct = (product) => {
  if (!product || typeof product !== "object") {
    return null;
  }

  const id = Number(product.id);

  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const price = Number(product.price);

  return {
    ...product,
    id,
    price:
      Number.isFinite(price) && price >= 0
        ? price
        : 0,
    title:
      typeof product.title === "string"
        ? product.title.trim()
        : "Untitled Product",
    thumbnail:
      typeof product.thumbnail === "string"
        ? product.thumbnail
        : "",
    images: Array.isArray(product.images)
      ? product.images
      : [],
  };
};

const normalizeWishlistItems = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  const normalizedItems = items
    .map(normalizeWishlistProduct)
    .filter(Boolean);

  return normalizedItems.filter(
    (item, index, array) =>
      index ===
      array.findIndex(
        (product) => product.id === item.id
      )
  );
};

export function WishlistProvider({ children }) {
  const { user } = useAuth();

  const userEmail = normalizeEmail(user?.email);

  const [wishlistItems, setWishlistItems] = useState(() => {
    const wishlistKey = getWishlistKey(userEmail);

    if (!wishlistKey) {
      return [];
    }

    const savedWishlist =
      localStorage.getItem(wishlistKey);

    if (!savedWishlist) {
      return [];
    }

    try {
      const parsedWishlist =
        JSON.parse(savedWishlist);

      return normalizeWishlistItems(parsedWishlist);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const wishlistKey = getWishlistKey(userEmail);

    if (!wishlistKey) {
      return;
    }

    localStorage.setItem(
      wishlistKey,
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems, userEmail]);

  const addToWishlist = (product) => {
    const normalizedProduct =
      normalizeWishlistProduct(product);

    if (!normalizedProduct) {
      return;
    }

    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) => item.id === normalizedProduct.id
      );

      if (alreadyExists) {
        return currentItems;
      }

      return [
        ...currentItems,
        normalizedProduct,
      ];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== Number(productId)
      )
    );
  };

  const toggleWishlist = (product) => {
    const normalizedProduct =
      normalizeWishlistProduct(product);

    if (!normalizedProduct) {
      return;
    }

    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) => item.id === normalizedProduct.id
      );

      if (alreadyExists) {
        return currentItems.filter(
          (item) => item.id !== normalizedProduct.id
        );
      }

      return [
        ...currentItems,
        normalizedProduct,
      ];
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item.id === Number(productId)
    );
  };

  const clearWishlist = () => {
    setWishlistItems([]);

    const wishlistKey = getWishlistKey(userEmail);

    if (wishlistKey) {
      localStorage.removeItem(wishlistKey);
    }
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}