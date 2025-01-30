import { useRef } from "react";

interface FourDigitInputProps {
  values: string[];
  setValues: (values: string[]) => void;
}

const FourDigitInput: React.FC<FourDigitInputProps> = ({
  setValues,
  values,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.match(/^\d?$/)) {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);

      if (value && index < 3) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };
  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex gap-2 w-full justify-center">
        {values.map((value, index) => (
          <input
            key={index}
            type="tel"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => {
              if (el) inputsRef.current[index] = el;
            }}
            className="aspect-square w-1/4 bg-green-300 text-3xl rounded-md text-center caret-transparent focus:outline-none focus:border-2 focus:border-green-300"
          />
        ))}
      </div>
    </div>
  );
};
export default FourDigitInput;
