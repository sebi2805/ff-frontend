"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import PasswordInput from "../../components/common/PasswordInput";
import { RegisterValidationErrors } from "../../interfaces/authentication";
import { UserSettings, UserSettingsPayload } from "../../interfaces/user";
import apiClient from "../../utils/apiClient";
import { getRole } from "../../utils/common";
import { decodeErrorMessage } from "../../utils/errorMessages";
import {
  isValidLocation,
  isValidPassword,
  isValidPasswordConfirm,
  isValidname,
} from "../../utils/validators";

const SettingsPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const [errors, setErrors] = useState<RegisterValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  const fetchRole = async () => {
    const userRole = await getRole();
    setRole(userRole);
  };

  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get<UserSettings>(
        "/api/Users/login-by-jwt"
      );
      setEmail(data.email);
      setLocation(data.location);
      setName(data.name);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data.");
    }
  };

  const checkErrors = (): RegisterValidationErrors => {
    const validationErrors: RegisterValidationErrors = {};

    if (name && !isValidname(name)) {
      validationErrors.name = "Name must be between 3 and 20 characters.";
    }

    if (location && !isValidLocation(location)) {
      validationErrors.location =
        "Location must be between 0 and 30 characters.";
    }

    if (password && !isValidPassword(password)) {
      validationErrors.password = "Password must be at least 8 characters.";
    }

    if (password && !isValidPasswordConfirm(password, passwordConfirm)) {
      validationErrors.passwordConfirm = "Passwords do not match.";
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  const handleSave = async () => {
    const validationErrors = checkErrors();
    if (Object.keys(validationErrors).length > 0) return;

    const payload: UserSettingsPayload = {};

    if (password) {
      payload.password = password;
    }

    setIsLoading(true);
    await apiClient
      .put("/api/Users/update-user", payload)
      .then(() => {
        toast.success("Settings updated successfully!");
      })
      .catch((error) => {
        const errorMessage = error.response?.data[0] || "Update failed.";
        toast.error(decodeErrorMessage(errorMessage));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUser();
    fetchRole();
  }, []);
  return (
    <div className="flex flex-col items-start justify-start gap-6 p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">Settings</h1>

      {/* Email */}
      <div className="w-full">
        <label
          htmlFor="email"
          className="block text-black-dark font-medium text-lg"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          disabled={true}
          className="w-full border-b border-gray-400 focus:border-purple-500 outline-none py-2 text-black-dark cursor-not-allowed"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* name */}
      <div className="w-full">
        <label
          htmlFor="name"
          className="block font-medium text-lg text-black-dark"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          className="w-full border-b border-gray-400 focus:border-purple-500 outline-none py-2 text-black-dark "
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {role === "GymOwner" && (
        <div className="w-full">
          <label
            htmlFor="location"
            className="block text-black-dark font-medium text-lg"
          >
            Location
          </label>
          <input
            type="text"
            id="name"
            className="w-full border-b border-gray-400 focus:border-purple-500 outline-none py-2 text-black-dark "
            value={location || ""}
            onChange={(e) => setLocation(e.target.value)}
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>
      )}

      <div className="w-full">
        <label
          htmlFor="confir-password"
          className="block text-black-dark font-medium text-lg"
        >
          New Password
        </label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-black-dark "
          placeholder="Enter a new password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <div className="w-full">
        <label
          htmlFor="password-confirm"
          className="block text-black-dark font-medium text-lg"
        >
          Confirm New Password
        </label>
        <PasswordInput
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="text-black-dark "
          placeholder="Confirm your new password"
        />
        {errors.passwordConfirm && (
          <p className="text-red-500 text-sm">{errors.passwordConfirm}</p>
        )}
      </div>

      <Button
        isLoading={isLoading}
        onClick={handleSave}
        className="bg-purple-600 text-xl px-6 py-3 rounded-md"
      >
        Save Changes
      </Button>
    </div>
  );
};

export default SettingsPage;
