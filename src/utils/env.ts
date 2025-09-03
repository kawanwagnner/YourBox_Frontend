// lê VITE_*
export function getEnv(key: string) {
  return import.meta.env[key];
}
