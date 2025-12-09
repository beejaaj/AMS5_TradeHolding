"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDestructive?: boolean; // Se verdadeiro, botão fica vermelho
}

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isDestructive = false 
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1E2329] border border-[#2B3139] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#2B3139] flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#EAECEF] flex items-center gap-2">
              <AlertTriangle className={isDestructive ? "text-[#F6465D]" : "text-[#FCD535]"} size={22} />
              {title}
            </h3>
            <button onClick={onClose} className="text-[#848E9C] hover:text-[#EAECEF] p-1 rounded hover:bg-[#2B3139] transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 text-center">
            <p className="text-[#848E9C] text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Footer / Actions */}
          <div className="p-4 bg-[#15181D] border-t border-[#2B3139] flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#2B3139] text-[#EAECEF] hover:bg-[#474D57] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg
                ${isDestructive 
                  ? "bg-[#F6465D] hover:bg-[#D9304E] shadow-[#F6465D]/20" 
                  : "bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-[#8B5CF6]/20"
                }`}
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};