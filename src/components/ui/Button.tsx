// Botão reutilizável

import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({ loading, children, ...props }: ButtonProps) {
  return (
    <button
      className="rounded-2xl shadow px-4 py-2 font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="spinner mr-2" /> : null}
      {children}
    </button>
  );
}
