import {
  useEffect,
  useState,
} from "react";
import { ReviewContext } from "./ReviewContext";
import { useAuth } from "./useAuth";
import { normalizeEmail } from "../utils/normalizeEmail";

export function ReviewProvider({ children }) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState(() => {
    const savedReviews =
      localStorage.getItem("shopsphere_reviews");

    if (!savedReviews) {
      return [];
    }

    try {
      const parsedReviews = JSON.parse(savedReviews);

      return Array.isArray(parsedReviews)
        ? parsedReviews
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "shopsphere_reviews",
      JSON.stringify(reviews)
    );
  }, [reviews]);

  const addReview = (review) => {
    setReviews((currentReviews) => [
      ...currentReviews,
      review,
    ]);
  };

  const getProductReviews = (productId) => {
    return reviews.filter(
      (review) => review.productId === productId
    );
  };

  const deleteReview = (reviewId) => {
    const currentUserEmail = normalizeEmail(
      user?.email
    );

    if (!currentUserEmail) {
      return false;
    }

    let deleted = false;

    setReviews((currentReviews) =>
      currentReviews.filter((review) => {
        const isTargetReview =
          review.id === reviewId;

        const reviewOwnerEmail = normalizeEmail(
          review.userEmail
        );

        const isOwner =
          reviewOwnerEmail === currentUserEmail;

        if (isTargetReview && isOwner) {
          deleted = true;
          return false;
        }

        return true;
      })
    );

    return deleted;
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        getProductReviews,
        deleteReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}