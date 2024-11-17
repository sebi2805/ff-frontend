import { useEffect, useRef, useState } from "react";

interface FourDigitInputProps{
    onSubmit: (number: string) => void;
}

const FourDigitInput: React.FC<FourDigitInputProps> = ({onSubmit}) => {
const [values, setValues] = useState(['', '', '', ''])
const [isDisabled, setIsDisabled] = useState(true)
const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

useEffect(() => {
    if(values.every((value) => value !== ''))
        setIsDisabled(false);
    else
        setIsDisabled(true);
}, values)

const handleChange = (index: number, value: string) => {
    if(value.match(/^\d?$/))
    {
        const newValues = [...values]
        newValues[index] = value;
        setValues(newValues);

        if(value && index < 3)
        {
            inputsRef.current[index+1]?.focus();
        }
    }

}
const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if(event.key === "Backspace" && !values[index] && index > 0)
    {
        inputsRef.current[index - 1]?.focus();
    }
}
const handleSendNumber = () => {
    const fullNumber : string = values.join("");
    onSubmit(fullNumber)
}

return(

    <div className="flex flex-col justify-center items-center">
        <div className="flex gap-2 w-full justify-center mt-10">
            {values.map((value, index) => (
                <input
                    key={index}
                    type="tel"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => {if(el) inputsRef.current[index] = el}}
                    className="h-[17vw] max-h-[150px] w-[17vw] max-w-[150px] bg-purple-400 rounded-md text-center caret-transparent focus:outline-none focus:border-2 focus:border-purple-200"
                    />
            ))}
        </div>
        <button onClick={handleSendNumber} disabled={isDisabled} 
                className="bg-purple-950 text-2xl font-bebas h-12 rounded-t-md mt-20 w-2/3 disabled:opacity-50">
            Verifică
        </button>
        <button className="text-xl h-12 rounded-b-md border-2 border-purple-950 w-2/3">
            Retrimite codul
        </button>
    </div>
)

}
export default FourDigitInput;