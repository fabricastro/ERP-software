import React from "react";
import { IoCloseCircle } from "react-icons/io5";

interface ConfirmDialogProps {
    closeModal: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    closeModal,
    onConfirm,
    title,
    message,
}) => {
    return (
        <div
            className="modal-container fixed z-999 flex inset-0 justify-center items-center bg-black bg-opacity-50"
            onClick={(e) => {
                if ((e.target as HTMLElement).classList.contains("modal-container")) {
                    closeModal();
                }
            }}
        >
            <div className="modal rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
                <div className="flex justify-between pb-4">
                    <h3 className="text-xl font-bold text-black dark:text-white">{title}</h3>
                    <button onClick={closeModal} className="text-black hover:text-gray-700 dark:text-white text-2xl">
                        <IoCloseCircle />
                    </button>
                </div>
                <p>{message}</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={closeModal}
                        className="bg-gray-400 px-4 py-2 text-[#000] dark:bg-white rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 px-4 py-2 text-white rounded"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
