"use client";

import * as React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={`label ${className}`}
      {...props}
    />
  );
}

export { Label };