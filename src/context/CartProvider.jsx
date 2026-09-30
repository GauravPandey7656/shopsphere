import {
  useEffect,
  useState,
} from "react";
import { CartContext } from "./CartContext";
import { useAuth } from "./useAuth";
import { normalizeEmail } from "../utils/normalizeEmail";

const getCartKey = (email) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  return `shopsphere_cart_${normalizedEmail}`;
};

const normalizeCartItems = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const id = Number(item.id);
      const price = Number(item.price);
      const quantity = Number(item.quantity);

      if (
        !Number.isFinite(id) ||
        id <= 0 ||
        !Number.isFinite(price) ||
        price < 0 ||
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        return null;
      }

      return {
        ...item,
        id,
        price,
        quantity: Math.floor(quantity),
      };
    })
    .filter(Boolean);
};

export function CartProvider({ children }) {
  const { user } = useAuth();

  const userEmail = normalizeEmail(user?.email);

  const [cartItems, setCartItems] = useState(() => {
    const cartKey = getCartKey(userEmail);

    if (!cartKey) {
      return [];
    }

    const savedCart = localStorage.getItem(cartKey);

    if (!savedCart) {
      return [];
    }

    try {
      const parsedCart = JSON.parse(savedCart);

      return normalizeCartItems(parsedCart);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const cartKey = getCartKey(userEmail);

    if (!cartKey) {
      return;
    }

    localStorage.setItem(
      cartKey,
      JSON.stringify(cartItems)
    );
  }, [cartItems, userEmail]);

  const addToCart = (product) => {
    if (!product || !Number.isFinite(Number(product.id))) {
      return;
    }

    const productId = Number(product.id);
    const productPrice = Number(product.price);
    const productStock = Number(product.stock);

    if (
      !Number.isFinite(productPrice) ||
      productPrice < 0
    ) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === productId
      );

      if (existingItem) {
        if (
          Number.isFinite(productStock) &&
          productStock > 0 &&
          existingItem.quantity >= productStock
        ) {
          return currentItems;
        }

        return currentItems.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      if (
        Number.isFinite(productStock) &&
        productStock <= 0
      ) {
        return currentItems;
      }

      return [
        ...currentItems,
        {
          ...product,
          id: productId,
          price: productPrice,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== Number(productId)) {
          return item;
        }

        const stock = Number(item.stock);

        if (
          Number.isFinite(stock) &&
          stock > 0 &&
          item.quantity >= stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === Number(productId)
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== Number(productId)
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);

    const cartKey = getCartKey(userEmail);

    if (cartKey) {
      localStorage.removeItem(cartKey);
    }
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}