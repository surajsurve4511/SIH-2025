import React from 'react';
import { XCircleIcon as CloseIcon } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl', '3xl': 'max-w-3xl'
  };

  return (
    <div className="fixed inset-0 bg-neutral-800/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" aria-modal="true" role="dialog">
      <div className={`bg-white rounded-lg shadow-xl p-6 w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto animate-modalShow`}>
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 z-10 border-b border-neutral-200 -mx-6 px-6">
          <h2 className="text-xl font-semibold text-neutral-700">{title}</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700" aria-label="Close modal">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="-mx-6 px-6 pb-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
