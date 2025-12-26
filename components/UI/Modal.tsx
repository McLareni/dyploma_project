"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null; 

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose} 
    >
      <div
        className="bg-white p-6 rounded shadow-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
      </div>
    </div>
  );
}
