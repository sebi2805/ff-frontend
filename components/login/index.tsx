"use client";

import { LockClosedIcon, MailIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LoginPayload, LoginResponse } from "../../interfaces/authentication";
import apiClient from "../../utils/apiClient";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(username)) {
      setError("Insert a valid email.");
      return;
    }

    try {
      const loginPayload: LoginPayload = {email: username, password: password}  
      const response = await apiClient.post<LoginResponse>("/api/Users/login", loginPayload);
      if(response.status === 200)
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
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block">Email</label>
                        <div className="icon-and-input flex gap-2">
                            <MailIcon className="h-6 w-6 text-purple-400"/>
                            <input 
                            type="text"
                            id="username" 
                            name="username" 
                            className="w-full bg-transparent border-b border-purple-400 caret-white focus:outline-none" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block">Password</label>
                        <div className="icon-and-input flex gap-2">
                            <LockClosedIcon className="h-6 w-6 text-purple-400"/>
                            <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            className="w-full bg-transparent border-b border-purple-400 caret-white focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="bg-purple-950 text-2xl font-bebas h-12 rounded-md">
                        Login
                    </button>
                </form>  
      </div>
    </div>
  );
};

export default LoginPage;
