// Implementación simple para SASS (sin Tailwind)
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}
