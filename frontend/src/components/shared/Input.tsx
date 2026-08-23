"use client";

import { useId } from "react";
import { InputProps } from "../../types";

function Input({
  label,
  placeholder,
  type,
  value,
  onChange,
  id,
  name,
  autoComplete,
  rightElement,
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500"
      >
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          id={inputId}
          name={name}
          type={type ? type : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          pattern={type === "tel" ? "[0-9]{3}-[0-9]{3}-[0-9]{4}" : undefined}
          autoComplete={autoComplete}
          required
          className={`h-12 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10 ${
            rightElement ? "pr-11" : ""
          }`}
        />

        {rightElement && (
          <div className="absolute right-2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

export default Input;
