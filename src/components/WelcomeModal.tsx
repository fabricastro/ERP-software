import React from "react";
import Modal from './ModalComponent';
import { useNavigate } from 'react-router-dom';
import { Config } from './../../node_modules/@types/react-transition-group/config.d';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSettings: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleGoToSettings = () => {
    onClose();
    navigate('/settings');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¡Bienvenido a PALTA!">
      <p className="mb-4">
        Para empezar a usar la aplicación, es necesario que completes los datos en el módulo de <strong>Información empresarial</strong> en el modulo de Configuración.
      </p>
      <button onClick={handleGoToSettings} className="px-4 py-2 bg-primary text-white rounded">
        Completar Información Empresarial
      </button>
    </Modal>
  );
};

export default WelcomeModal;
