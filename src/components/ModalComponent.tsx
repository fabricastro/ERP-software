import React from "react";
import { IoCloseCircle } from "react-icons/io5";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    width?: string;
    height?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, width = "100%", height = "auto" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className="bg-white rounded-lg shadow-lg mx-auto p-6"
                style={{ width: width, height: height, maxWidth: "1024px" }}
            >
                {/* Modal header */}
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-black text-2xl focus:outline-none">
                        <IoCloseCircle />
                    </button>
                </div>

                {/* Modal content */}
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
