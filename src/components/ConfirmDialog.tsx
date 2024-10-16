import React from "react";

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
            className="modal-container fixed z-50 flex inset-0 justify-center items-center bg-black bg-opacity-50"
            onClick={(e) => {
                if ((e.target as HTMLElement).classList.contains("modal-container")) {
                    closeModal();
                }
            }}
        >
            <div className="modal rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
                <div className="w-full flex justify-end">
                    <strong
                        className="text-xl align-center cursor-pointer"
                        onClick={closeModal}
                    >
                        &times;
                    </strong>
                </div>
                <h2 className="text-lg font-bold">{title}</h2>
                <p>{message}</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={closeModal}
                        className="bg-gray-400 px-4 py-2 text-[#000] rounded"
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
