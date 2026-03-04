import * as React from "react";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const variantClass = `button--${variant}`;
    const sizeClass = `button--${size}`;

    return (
      <button
        ref={ref}
        data-slot="button"
        className={`button ${variantClass} ${sizeClass} ${className}`.trim()}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };