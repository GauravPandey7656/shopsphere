function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 sm:h-12 sm:w-12"
        aria-hidden="true"
      />

      <p className="mt-4 text-sm font-medium text-gray-600 sm:text-base">
        {message}
      </p>
    </div>
  );
}

export default LoadingSpinner;