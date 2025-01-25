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

// Importa react-select
import Select from "react-select";

// (1) Definește opțiunile pentru plan (același array ca în PlanSelectModal)
const planOptions = [
  { value: "Beginner", label: "Fundament (Beginner)" },
  { value: "Intermediate", label: "Evolution (Intermediate)" },
  { value: "Advanced", label: "Performance (Advanced)" },
  { value: "Expert", label: "Elite (Expert)" },
];

// (2) Definim un stil personalizat pentru <Select>
const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "#fff", // poți modifica dacă vrei altă culoare
    color: "#111",
    borderColor: state.isFocused ? "#a872ff" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 1px #a872ff" : undefined,
    "&:hover": {
      borderColor: "#a872ff",
    },
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 10,
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#111",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#888",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#a872ff" : "#fff",
    color: state.isFocused ? "#fff" : "#111",
  }),
};

const SettingsPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const [fitnessPlan, setFitnessPlan] = useState<string | null>(null); // (2) Starea pentru plan

  const [errors, setErrors] = useState<RegisterValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  const fetchRole = async () => {
    const userRole = await getRole();
    setRole(userRole);
  };

  // (3) Fetch user + populare fitnessPlan dacă există în datele userului
  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get<UserSettings>(
        "/api/Users/login-by-jwt"
      );
      setEmail(data.email);
      setLocation(data.location);
      setName(data.name);

      // Dacă pe backend ai definit un câmp `fitnessPlan`, setează-l:

      if (data.fitnessPlan) {
        setFitnessPlan(data.fitnessPlan);
      }
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

    // Adaugă în payload doar dacă există o valoare
    if (password) {
      payload.password = password;
    }

    if (name) {
      payload.name = name;
    }

    if (location) {
      payload.location = location;
    }

    // (4) În payload, trimite și fitnessPlan, dacă ai un câmp dedicat în backend
    if (fitnessPlan) {
      switch (fitnessPlan) {
        case "fundament":
          payload.fitnessPlan = 0;
          break;
        case "evolution":
          payload.fitnessPlan = 1;
          break;
        case "performance":
          payload.fitnessPlan = 2;
          break;
        case "elite":
          payload.fitnessPlan = 3;
          break;
        default:
          break;
      }
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
    <div className="flex flex-col bg-white items-center mt-12 rounded-md gap-6 p-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-green-300">Settings</h1>

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
          className="w-full border-b border-gray-400 focus:border-green-200 outline-none py-2 text-black-dark cursor-not-allowed"
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
          className="w-full border-b border-gray-400 focus:border-green-200 outline-none py-2 text-black-dark "
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
            className="w-full border-b border-gray-400 focus:border-green-200 outline-none py-2 text-black-dark "
            value={location || ""}
            onChange={(e) => setLocation(e.target.value)}
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>
      )}

      {role === "NormalUser" && (
        <div className="w-full">
          <label
            htmlFor="fitnessPlan"
            className="block text-black-dark font-medium text-lg"
          >
            Fitness Plan
          </label>
          <Select
            id="fitnessPlan"
            options={planOptions}
            value={planOptions.find((option) => option.value === fitnessPlan)}
            onChange={(option) => setFitnessPlan(option?.value || null)}
            styles={customSelectStyles} // folosește stilul custom
            placeholder="Select your fitness plan"
          />
        </div>
      )}
      {/* Parola nouă */}
      <div className="w-full">
        <label
          htmlFor="new-password"
          className="block text-black-dark font-medium text-lg"
        >
          New Password
        </label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-black-dark"
          placeholder="Enter a new password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      {/* Confirmare parola nouă */}
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
          className="text-black-dark"
          placeholder="Confirm your new password"
        />
        {errors.passwordConfirm && (
          <p className="text-red-500 text-sm">{errors.passwordConfirm}</p>
        )}
      </div>

      <Button
        isLoading={isLoading}
        onClick={handleSave}
        className="bg-green-200 text-xl px-6 py-3 rounded-md"
      >
        Save Changes
      </Button>
    </div>
  );
};

export default SettingsPage;
