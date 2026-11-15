import {
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type InputProps = {
  label: string;
  rightElement?: ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

export default function Input({
  label,
  rightElement,
  id,
  className = "",
  type = "text",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-bold text-neutral-300"
      >
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          id={inputId}
          type={type}
          className={`h-12 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60 ${
            rightElement ? "pr-12" : ""
          } ${className}`}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
