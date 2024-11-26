"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { VerifyTokenPayload } from "../../interfaces/authentication";
import apiClient from "../../utils/apiClient";
import FourDigitInput from "./PinInput";

const VerifyPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail: string | null = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // TODO
  const handleSubmit = async (token: number) => {
    // try {
    const verifyPayload: VerifyTokenPayload = { email: email, token: token };
    const response = await apiClient.post(
      "/api/Users/verify-token",
      verifyPayload
    );
    if (response.status === 200) {
      router.push("/");
      localStorage.removeItem("email");
    }
    // TODO
    setError("");
    // } catch (err) {
    //   setError("Invalid Token");
    // }
  };

  return (
    <>
      <div className="root-div flex items-center justify-center h-[100dvh] bg-black">
        <div className="verify-page flex flex-col items-center h-full w-full max-h-[800px] max-w-md bg-purple-600 p-6">
          <h1 className="font-bold text-3xl">Check your inbox</h1>
          <p className="text-md mt-10">
            {" "}
            We&apos;ve sent you a confirmation code at{" "}
          </p>
          <p className="text-lg">{email}</p>
          <FourDigitInput onSubmit={handleSubmit} error={error} />
          <button
            onClick={() => router.push("/login")}
            className="w-fit mt-3 text-xl"
          >
            Back to login
          </button>
        </div>
      </div>
    </>
  );
};

export default VerifyPage;
