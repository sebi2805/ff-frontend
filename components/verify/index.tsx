"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FourDigitInput from "./PinInput";
import Link from "next/link";
import apiClient from "../../utils/apiClient";
import { isValidEmail } from "../../utils/validators";
import { decodeErrorMessage } from "../../utils/errorMessages";
import Button from "../common/Button";

const VerifyPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState<string>("");
  const [values, setValues] = useState<string[]>(["", "", "", ""]);
  const [emailDisabled, setEmailDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; token?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
      setEmailDisabled(true);
    }
  }, [searchParams]);

  const validateInputs = () => {
    const validationErrors: { email?: string; token?: string } = {};
    if (!isValidEmail(email)) {
      validationErrors.email = "Please enter a valid email address.";
    }
    if (!values.every((value) => value !== "" && !isNaN(parseInt(value)))) {
      validationErrors.token =
        "Please enter a valid 4-digit verification code.";
    }
    setErrors(validationErrors);
    return validationErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);
    const verifyPayload = {
      email,
      token: parseInt(
        values.reduce((acc, value) => acc + value, ""),
        10
      ),
    };
    await apiClient
      .post("/api/Users/verify-token", verifyPayload)
      .then(() => {
        toast.success("Email verified successfully.");
        setIsLoading(false);
        setTimeout(() => router.push("/login"), 500);
      })
      .catch((error) => {
        const errorMessage = error.response?.data[0] || "Verification failed.";
        toast.error(decodeErrorMessage(errorMessage));
        setIsLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center h-[100vh] bg-black-light">
      <div className="flex flex-col items-center w-full max-w-md bg-purple-600 p-20 rounded-md">
        <h1 className="font-bold text-3xl">Verify Your Email</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full mt-6 items-center"
        >
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="text-lg font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full bg-transparent border-b border-purple-400 caret-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailDisabled}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          {/* I included the button here just to have the appeal of the same width */}
          <div className="flex flex-col gap-2 w-fit">
            <label htmlFor="token" className="text-lg font-medium">
              Verification Code
            </label>
            <FourDigitInput values={values} setValues={setValues} />
            {errors.token && <p className="text-red-500">{errors.token}</p>}
            <Button
              isLoading={isLoading}
              type="submit"
              className="w-full bg-purple-400 text-white font-semibold py-2 rounded-md hover:bg-purple-700 transition-all"
            >
              Verify
            </Button>
          </div>
        </form>
        <Link
          href={"/login"}
          className="w-fit mt-3 text-md text-black-dark underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default VerifyPage;
