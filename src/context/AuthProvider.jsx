import {
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { normalizeEmail } from "../utils/normalizeEmail";

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts =
      localStorage.getItem("shopsphere_accounts");

    if (savedAccounts) {
      try {
        const parsedAccounts = JSON.parse(savedAccounts);

        if (Array.isArray(parsedAccounts)) {
          return parsedAccounts;
        }
      } catch {
        return [];
      }
    }

    const oldAccount =
      localStorage.getItem("shopsphere_account");

    if (oldAccount) {
      try {
        const parsedAccount = JSON.parse(oldAccount);

        if (
          parsedAccount &&
          typeof parsedAccount === "object" &&
          parsedAccount.email
        ) {
          return [parsedAccount];
        }
      } catch {
        return [];
      }
    }

    return [];
  });

  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("shopsphere_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "shopsphere_accounts",
      JSON.stringify(accounts)
    );
  }, [accounts]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "shopsphere_user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("shopsphere_user");
    }
  }, [user]);

  const signup = (userData) => {
    const email = normalizeEmail(userData.email);

    const existingAccount = accounts.find(
      (account) =>
        normalizeEmail(account.email) === email
    );

    if (existingAccount) {
      return {
        success: false,
        message:
          "An account with this email already exists.",
      };
    }

    const newAccount = {
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email,
      password: userData.password,
    };

    setAccounts((currentAccounts) => [
      ...currentAccounts,
      newAccount,
    ]);

    const loggedInUser = {
      firstName: newAccount.firstName,
      lastName: newAccount.lastName,
      email: newAccount.email,
    };

    setUser(loggedInUser);

    return {
      success: true,
    };
  };

  const login = (email, password) => {
    const normalizedEmail = normalizeEmail(email);

    const matchingAccount = accounts.find(
      (account) =>
        normalizeEmail(account.email) ===
          normalizedEmail &&
        account.password === password
    );

    if (!matchingAccount) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const loggedInUser = {
      firstName: matchingAccount.firstName,
      lastName: matchingAccount.lastName,
      email: matchingAccount.email,
    };

    setUser(loggedInUser);

    return {
      success: true,
    };
  };

  const updateProfile = (updatedData) => {
    if (!user) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    const currentEmail = normalizeEmail(user.email);
    const newEmail = normalizeEmail(updatedData.email);

    const emailAlreadyUsed = accounts.some(
      (account) =>
        normalizeEmail(account.email) === newEmail &&
        normalizeEmail(account.email) !== currentEmail
    );

    if (emailAlreadyUsed) {
      return {
        success: false,
        message:
          "This email is already used by another account.",
      };
    }

    setUser((currentUser) => ({
      ...currentUser,
      firstName: updatedData.firstName.trim(),
      lastName: updatedData.lastName.trim(),
      email: newEmail,
    }));

    setAccounts((currentAccounts) =>
      currentAccounts.map((account) => {
        if (
          normalizeEmail(account.email) === currentEmail
        ) {
          return {
            ...account,
            firstName: updatedData.firstName.trim(),
            lastName: updatedData.lastName.trim(),
            email: newEmail,
          };
        }

        return account;
      })
    );

    return {
      success: true,
    };
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        accounts,
        signup,
        login,
        updateProfile,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}