"use client";

import { LockClosedIcon, MailIcon, UserIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RegisterPayload, RegisterValidationErrors } from "../../interfaces/authentication";
import apiClient from "../../utils/apiClient";

const RegisterPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errors, setErrors] = useState<RegisterValidationErrors>({});

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

    const isValidPassword = (password: string) => {
        return password.length > 8;
    }

    const isValidPasswordConfirm = (passwordConfirm: string) =>
    {
        return passwordConfirm === password
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors : RegisterValidationErrors = {}

        if (!isValidEmail(email)) {
            validationErrors.email = "Insert a valid email."
        }

        if (!isValidPassword(password)) {
            validationErrors.password = "Password must be at least 8 characters."
        }

        if(!isValidPasswordConfirm(passwordConfirm))
        {
            validationErrors.passwordConfirm = "Passwords do not match."
        }

        if (Object.keys(validationErrors).length > 0) {
            console.log("errors found")
            setErrors(validationErrors);
            return;
        }
        
        try {
            const registerPayload : RegisterPayload = {name: username, email: email, password: password}
            const response = await apiClient.post("/api/Users/register-user", registerPayload);
            if(response.status === 200)
            {
                localStorage.setItem("email", email)
                router.push("/verify-token");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return(
        <div className="root-div flex items-center justify-center h-[100dvh] bg-black">
            <div className="register-page bg-purple-600 h-full w-[100vw] max-h-[800px] max-w-md flex flex-col items-center justify-around p-10">
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
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block">Email</label>
                        <div className="icon-and-input flex gap-2">
                            <MailIcon className="h-6 w-6 text-purple-400"/>
                            <input 
                            type="email"
                            id="email" 
                            name="email" 
                            className="w-full bg-transparent border-b border-purple-400 caret-white focus:outline-none" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 mb-4">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="username" className="block">Username</label>
                        <div className="icon-and-input flex gap-2">
                            <UserIcon className="h-6 w-6 text-purple-400"/>
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
                        {errors.password && <p className="text-red-500 text-sm mb-4">{errors.password}</p>}

                    </div>
                    <div>
                        <label htmlFor="password-confirm" className="block">Confirm Password</label>
                        <div className="icon-and-input flex gap-2">
                            <LockClosedIcon className="h-6 w-6 text-purple-400"/>
                            <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            className="w-full bg-transparent border-b border-purple-400 caret-white focus:outline-none"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            />
                        </div>
                        {errors.passwordConfirm && <p className="text-red-500 text-sm mb-4">{errors.passwordConfirm}</p>}

                    </div>
                    <button type="submit" className="bg-purple-950 text-2xl font-bebas h-12 rounded-md">
                        Register
                    </button>
                    <button onClick={()=>router.push("/login")} className="bg-purple-400 text-2xl font-bebas h-12 rounded-md">
                        Log in
                    </button>
                </form>  
            </div>
        </div>
    )
}

export default RegisterPage;