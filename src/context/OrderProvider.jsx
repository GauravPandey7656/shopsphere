import {
  useEffect,
  useState,
} from "react";
import { OrderContext } from "./OrderContext";

const normalizeOrders = (orders) => {
  if (!Array.isArray(orders)) {
    return [];
  }

  return orders
    .map((order) => {
      if (!order || typeof order !== "object") {
        return null;
      }

      const id =
        typeof order.id === "string" && order.id.trim()
          ? order.id
          : null;

      const total = Number(order.total);

      if (!id || !Number.isFinite(total) || total < 0) {
        return null;
      }

      return {
        ...order,
        id,
        total,
        items: Array.isArray(order.items)
          ? order.items
          : [],
        status:
          typeof order.status === "string" &&
          order.status.trim()
            ? order.status
            : "Confirmed",
        createdAt:
          typeof order.createdAt === "string"
            ? order.createdAt
            : new Date().toISOString(),
      };
    })
    .filter(Boolean);
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const savedOrders =
      localStorage.getItem("shopsphere_orders");

    if (!savedOrders) {
      return [];
    }

    try {
      const parsedOrders = JSON.parse(savedOrders);

      return normalizeOrders(parsedOrders);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "shopsphere_orders",
      JSON.stringify(orders)
    );
  }, [orders]);

  const addOrder = (order) => {
    if (!order || typeof order !== "object") {
      return false;
    }

    const total = Number(order.total);

    if (
      !Number.isFinite(total) ||
      total < 0 ||
      !Array.isArray(order.items) ||
      order.items.length === 0
    ) {
      return false;
    }

    const orderId =
      typeof order.id === "string" && order.id.trim()
        ? order.id
        : `ORD-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)
            .toUpperCase()}`;

    const normalizedOrder = {
      ...order,
      id: orderId,
      total,
      items: order.items,
      status:
        typeof order.status === "string" &&
        order.status.trim()
          ? order.status
          : "Confirmed",
      createdAt:
        typeof order.createdAt === "string"
          ? order.createdAt
          : new Date().toISOString(),
    };

    setOrders((currentOrders) => [
      ...currentOrders,
      normalizedOrder,
    ]);

    return true;
  };

  const clearOrders = () => {
    setOrders([]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        clearOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}