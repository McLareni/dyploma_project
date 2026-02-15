import { InputHTMLAttributes } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string | string[];
}

export default function CustomInput({
  id,
  label,
  error,
  className = "",
  ...props
}: IProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        id={id}
        name={id}
        className={`
          px-3 py-2
          border
          rounded-md
          text-base
          outline-none
          transition
          ${error ? "border-red-500" : "border-gray-300"}
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200
          ${className}
        `}
        {...props}
      />

      {error && Array.isArray(error) && (
        <ul className="text-red-500 text-sm lg:mt-1 list-disc pl-5">
          {error.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {error && typeof error === "string" && (
        <p className="text-red-500 text-sm lg:mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
