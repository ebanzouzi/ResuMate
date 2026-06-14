import React from "react";

export default function Input({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label py-1">
          <span className="label-text font-bold text-xs opacity-80">
            {label}
          </span>
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input input-bordered w-full input-sm rounded-lg focus:border-primary transition-colors text-sm"
      />
    </div>
  );
}
