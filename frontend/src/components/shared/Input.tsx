
import { InputProps } from "@/types";
import React from "react";

function Input({ label, placeholder, type, value, onChange }: InputProps) {
  return (
    <div className="flex flex-col w-64  p-2 m-2 rounded-md border border-gray-900   bg-gray-600">
      <label htmlFor="" className="text-gray-300 font-bold text-[12px]">
        {label}
      </label>
      <input
        type={type ? type : "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        pattern={type === "tel" ? "[0-9]{3}-[0-9]{3}-[0-9]{4}" : undefined}
        className="w-full rounded-md bg-transparent outline-0 text-[14px] text-white"
        required
      />
    </div>
  );
}

export default Input;
