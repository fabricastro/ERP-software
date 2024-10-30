// WelcomeModal.tsx
import React from "react";
import Modal from './ModalComponent';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSettings: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, onGoToSettings }) => {
  // console.log("WelcomeModal isOpen:", isOpen);

  if (!isOpen) return null; // Asegúrate de que el modal solo se muestre cuando `isOpen` es true

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¡Bienvenido a PALTA!">
      <p className="mb-4">
        Para empezar a usar la aplicación, es necesario que completes los datos en la sección de <strong>Información empresarial</strong> en el módulo de Configuración.
      </p>
      <button onClick={onGoToSettings} className="px-4 py-2 bg-primary text-white rounded">
        Completar Información Empresarial
      </button>
    </Modal>
  );
};

export default WelcomeModal;
