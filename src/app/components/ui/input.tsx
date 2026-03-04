import * as React from "react";

function Input({
  className = "",
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={`input ${className}`.trim()}
      {...props}
    />
  );
}

export { Input };