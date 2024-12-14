import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { FC, InputHTMLAttributes, useState } from "react";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your password",
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center gap-2 border-b w-full border-purple-400 pb-1">
      <input
        type={showPassword ? "text" : "password"}
        className={`w-full bg-transparent caret-white focus:outline-none ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="text-purple-400 focus:outline-none"
      >
        {showPassword ? (
          <EyeOffIcon className="h-6 w-6" />
        ) : (
          <EyeIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
