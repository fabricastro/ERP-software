import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeModal from '../components/WelcomeModal';
import { useSettings } from '../context/SettingsContext';

const MODAL_INTERVAL_MS = 5 * 60 * 1000;

function withWelcomeModal<T>(WrappedComponent: React.ComponentType<T>) {
    return (props: T) => {
        const { isBusinessInfoComplete, loading } = useSettings(); // Agregar `loading` aquí
        const navigate = useNavigate();
        const [showWelcomeModal, setShowWelcomeModal] = useState(false);

        useEffect(() => {
            if (loading) return; // Espera hasta que se cargue la información completamente

            const businessInfoComplete = isBusinessInfoComplete();
            const lastShown = localStorage.getItem('lastWelcomeModalShown');
            const now = Date.now();
            if (!businessInfoComplete && (!lastShown || now - parseInt(lastShown, 10) > MODAL_INTERVAL_MS)) {
                setShowWelcomeModal(true);
                localStorage.setItem('lastWelcomeModalShown', now.toString());
            } else {
                setShowWelcomeModal(false); // Oculta el modal si la información está completa
            }
        }, [isBusinessInfoComplete, loading]);

        const goToSettings = () => {
            setShowWelcomeModal(false);
            navigate('/settings');
        };

        return (
            <>
                <WrappedComponent {...props} />
                <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} onGoToSettings={goToSettings} />
            </>
        );
    };
}

export default withWelcomeModal;
