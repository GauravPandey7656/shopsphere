import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Profile() {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFormError("");
  };

  const handleEdit = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    });

    setFormError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    });

    setFormError("");
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormError("");

    const result = updateProfile(formData);

    if (!result.success) {
      setFormError(result.message);
      return;
    }

    setIsEditing(false);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Account
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            View and manage your account information.
          </p>
        </div>

        {/* Account Card */}
        <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6 md:p-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-4 border-b border-gray-200 pb-6 text-center sm:flex-row sm:text-left sm:pb-8">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 sm:h-20 sm:w-20 sm:text-3xl">
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-xl font-bold text-gray-900 sm:text-2xl">
                {user?.firstName} {user?.lastName}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-600 sm:text-base">
                {user?.email}
              </p>
            </div>
          </div>

          {isEditing ? (
            /* Edit Profile */
            <form
              onSubmit={handleSubmit}
              className="mt-6 sm:mt-8"
            >
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Edit Profile
              </h2>

              {formError && (
                <p
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                  role="alert"
                >
                  ⚠️ {formError}
                </p>
              )}

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-base"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-base"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-base"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto sm:text-base"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Personal Information */}
              <div className="mt-6 sm:mt-8">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Personal Information
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="rounded-lg bg-gray-50 p-4 sm:p-5">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      First Name
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-gray-900 sm:text-base">
                      {user?.firstName}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 sm:p-5">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Last Name
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-gray-900 sm:text-base">
                      {user?.lastName}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 sm:col-span-2 sm:p-5">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Email Address
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-gray-900 sm:text-base">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Actions */}
              <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:mt-8 sm:flex-row sm:pt-8">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto sm:text-base"
                >
                  Edit Profile
                </button>

                <Link
                  to="/orders"
                  className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:text-base"
                >
                  View Orders
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Profile;