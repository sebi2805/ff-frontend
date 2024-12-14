"use client";

import {
  LocationMarkerIcon,
  LockClosedIcon,
  MailIcon,
  UserIcon,
} from "@heroicons/react/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GymRegisterPayload,
  RegisterValidationErrors,
} from "../../interfaces/authentication";
import apiClient from "../../utils/apiClient";
import { decodeErrorMessage } from "../../utils/errorMessages";
import {
  isValidEmail,
  isValidLocation,
  isValidname,
  isValidPassword,
  isValidPasswordConfirm,
} from "../../utils/validators";
import Button from "../common/Button";
import PasswordInput from "../common/PasswordInput";

const GymRegisterPage: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [name, setname] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [errors, setErrors] = useState<RegisterValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const checkErrors = () => {
    const validationErrors: RegisterValidationErrors = {};

    if (!isValidEmail(email)) {
      validationErrors.email = "Insert a valid email.";
    }

    if (!isValidname(name)) {
      validationErrors.name = "name must be between 3 and 20 characters.";
    }

    if (!isValidPassword(password)) {
      validationErrors.password = "Password must be at least 8 characters.";
    }

    if (!isValidPasswordConfirm(password, passwordConfirm)) {
      validationErrors.passwordConfirm = "Passwords do not match.";
    }

    if (!isValidLocation(location)) {
      validationErrors.location = "Location is required.";
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorsObj = checkErrors();
    if (Object.keys(errorsObj).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);
    const gymRegisterPayload: GymRegisterPayload = {
      name: name,
      email: email,
      password: password,
      location: location,
    };

    await apiClient
      .post("/api/Users/register-gym", gymRegisterPayload)
      .then(() => {
        toast.success("Registration successful! Please verify your email.");
        setIsLoading(false);
        setTimeout(() => {
          router.push("/verify-token");
        }, 500);
      })
      .catch((error) => {
        const errorMessage = error.response?.data[0] || "Registration failed.";
        toast.error(decodeErrorMessage(errorMessage));
        setIsLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center h-[100vh] bg-black-light">
      <div className="register-page bg-purple-600 h-full max-h-[800px] w-[100vw] max-w-md flex overflow-y-auto flex-col items-center justify-around p-10 rounded-md">
        <div className="logo-and-name flex flex-col items-center w-full">
          <Image
            className="logo flex-none"
            src="/logo_4.png"
            alt="logo"
            width={100}
            height={100}
          />
          <h1 className="text-5xl font-bebas">FIT FLOW</h1>
        </div>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={handleSubmit}
          autoComplete="one-time-code"
        >
          <div>
            <label htmlFor="email" className="block">
              Email
            </label>
            <div className="flex gap-2">
              <MailIcon className="h-6 w-6 text-purple-400" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full bg-transparent border-b border-purple-400 caret-white focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="name" className="block">
              name
            </label>
            <div className="flex gap-2">
              <UserIcon className="h-6 w-6 text-purple-400" />
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-transparent border-b border-purple-400 caret-white focus:outline-none"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </div>
            {errors.name && <p className="text-red-500 ">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="location" className="block">
              Location
            </label>
            <div className="flex gap-2">
              <LocationMarkerIcon className="h-6 w-6 text-purple-400" />
              <input
                type="text"
                id="location"
                name="location"
                autoComplete="new-location"
                placeholder="Enter your location"
                className="w-full bg-transparent border-b border-purple-400 caret-white focus:outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            {errors.location && (
              <p className="text-red-500 ">{errors.location}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block">
              Password
            </label>
            <div className="flex gap-2">
              <LockClosedIcon className="h-6 w-6 text-purple-400" />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm ">{errors.password}</p>
            )}
          </div>
          <div>
            <label htmlFor="password-confirm" className="block">
              Confirm Password
            </label>
            <div className="flex gap-2">
              <LockClosedIcon className="h-6 w-6 text-purple-400" />
              <PasswordInput
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
            {errors.passwordConfirm && (
              <p className="text-red-500 text-sm ">{errors.passwordConfirm}</p>
            )}
          </div>
          <Button
            isLoading={isLoading}
            type="submit"
            className="bg-purple-950 text-2xl font-bebas h-12 rounded-md"
          >
            Register
          </Button>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="bg-purple-400 text-2xl font-bebas h-12 rounded-md"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default GymRegisterPage;
