"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(usernameOrEmail)) {
      setError("Introdu un email valid.");
      return;
    }

    try {
      //       const response = await apiClient.post<LoginResponse>("/api/Users/login", {
      //         usernameOrEmail,
      //         password,
      //       });

      router.push("/home");
    } catch (err) {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-purple-600 text-white shadow-md rounded-md">
        <div className="flex flex-col items-center mb-6">
          {/* Logo */}
          <Image
            src="/logo_4.png"
            alt="FitFlow Logo"
            width={100}
            height={100}
            objectFit="contain"
          />
          {/* Titlu */}
          <h1 className="text-3xl font-bold mt-2">FIT FLOW</h1>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            Email
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full border p-2 mt-1 text-black rounded-md"
              required
            />
          </label>
          <label className="block mb-6">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 mt-1 text-black rounded-md"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
