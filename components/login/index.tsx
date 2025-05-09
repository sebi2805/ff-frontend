"use client";

import { LockClosedIcon, MailIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LoginPayload, LoginResponse } from "../../interfaces/authentication";
import apiClient from "../../utils/apiClient";
import { decodeErrorMessage } from "../../utils/errorMessages";
import { toast } from "react-toastify";
import { setCookie } from "../../utils/cookies";
import { isValidEmail } from "../../utils/validators";
import PasswordInput from "../common/PasswordInput";
import Button from "../common/Button";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(name)) {
      setError("Insert a valid email.");
      return;
    }

    setIsLoading(true);
    const loginPayload: LoginPayload = {
      email: name,
      password: password,
    };

    await apiClient
      .post<LoginResponse>("/api/Users/login", loginPayload)
      .then((res) => {
        setCookie("access-token", res.data.token);
        toast.success("Login successful!");
        setIsLoading(false);
        setTimeout(() => {
          router.push("/home");
        }, 500);
      })
      .catch((err) => {
        setError(decodeErrorMessage(err.response.data[0]));
        toast.error(decodeErrorMessage(err.response.data[0]));
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-300">
      <div className="w-full max-w-md p-8 bg-green-100 text-white shadow-md rounded-md">
        <div className="flex flex-col items-center mb-6">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="FitFlow Logo"
            width={100}
            height={100}
            objectFit="contain"
          />
          {/* Titlu */}
          <h1 className="text-3xl font-bold mt-2">FIT FLOW</h1>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block">
              Email
            </label>
            <div className="flex gap-2">
              <MailIcon className="h-6 w-6 text-green-200" />
              <input
                type="text"
                id="name"
                placeholder="Enter your email"
                name="name"
                className="w-full bg-transparent border-b border-green-200 caret-white focus:outline-none placeholder-black-dark"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block">
              Password
            </label>
            <div className="flex gap-2">
              <LockClosedIcon className="h-6 w-6 text-green-200" />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </div>
          <Button
            isLoading={isLoading}
            type="submit"
            className="bg-green-200 text-2xl font-bebas h-12 rounded-md"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
