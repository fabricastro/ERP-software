// withWelcomeModal.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeModal from '../components/WelcomeModal';
import { useSettings } from '../context/SettingsContext';

const MODAL_INTERVAL_MS = 15 * 60 * 1000; // 15 minutos

function withWelcomeModal<T>(WrappedComponent: React.ComponentType<T>) {
    return (props: T) => {
        const { isBusinessInfoComplete } = useSettings();
        const navigate = useNavigate();
        const [showWelcomeModal, setShowWelcomeModal] = useState(false);

        useEffect(() => {
            const businessInfoComplete = isBusinessInfoComplete();
            const lastShown = localStorage.getItem('lastWelcomeModalShown');
            const now = Date.now();

            // console.log("Business info complete:", businessInfoComplete);
            // console.log("Last shown time:", lastShown);
            // console.log("Current time:", now);
            // console.log("Time difference:", lastShown ? now - parseInt(lastShown, 10) : "No last shown time");

            if (!businessInfoComplete && (!lastShown || now - parseInt(lastShown, 10) > MODAL_INTERVAL_MS)) {
                setShowWelcomeModal(true);
                localStorage.setItem('lastWelcomeModalShown', now.toString());
                console.log("Showing Welcome Modal");
            }
        }, [isBusinessInfoComplete]);



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
