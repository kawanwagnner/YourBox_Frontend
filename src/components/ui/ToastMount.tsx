// ToastMount: ponto de montagem para toasts
import { useEffect } from "react";

export default function ToastMount() {
  useEffect(() => {
    // Aqui pode ser integrado com uma lib de toast ou custom
  }, []);
  return <div id="toast-root" className="fixed top-4 right-4 z-50" />;
}
