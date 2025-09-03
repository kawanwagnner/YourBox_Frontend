// Modal reutilizável
import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow p-6 min-w-[300px] relative">
        <button
          className="absolute top-2 right-2"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
