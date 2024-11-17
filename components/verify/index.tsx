"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FourDigitInput from "../PinInput";

const VerifyPage: React.FC = () => {
    const router = useRouter();
    const[email, setEmail] = useState("");

    useEffect(() => {
        const storedEmail: string | null = localStorage.getItem("email");
        if(storedEmail)
            setEmail(storedEmail)
    }, []);

    const handleSubmit = async (number : string) => {
        console.log("complete number: ", number)
        try{
            // const response = await apiClient.post('/api/Users/verify', number);
            // if(response.status === 200)
            //     router.push("/")
            if(number === "1234")
                router.push("/")
        }
        catch(err)
        {
            console.error("Invalid Token ", err)
        }
    }

    return(
        <>
            <div className="root-div flex flex-col h-[100dvh] bg-purple-600 p-6">
                <h1 className="font-bold text-3xl">Verifică-ți mail-ul</h1>
                <p className="text-md mt-10"> V-am trimis un cod de confirmare la adresa </p>
                <p className="text-lg text-center">{email}</p>
                <FourDigitInput onSubmit={handleSubmit}/>
                <button onClick={()=>router.push('/login')} className="w-fit mt-3 text-xl" >înapoi la logare</button>
            </div>
        </>
    )
}

export default VerifyPage;