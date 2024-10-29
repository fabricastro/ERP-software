import { useEffect } from 'react';
import FormInput from '../../components/Input/input';

interface CategoryModalProps {
    mode: 'add' | 'edit' | 'view';
    color: string;
    setColor: (value: string) => void;
    name: string;
    setName: (value: string) => void;
    onSave: () => void;
    onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    mode,
    color,
    setColor,
    name,
    setName,
    onSave,
    onClose,
}) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && mode !== 'view') {
                event.preventDefault();
                onSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSave, mode]);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
                label="Nombre de la categoría"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={mode === 'view'}
            />
            <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Color: *
                </label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                    disabled={mode === 'view'}
                    className="h-12 p-1 rounded-lg border-[1.5px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary"
                />
            </div>
            {mode !== 'view' && (
                <div className="col-span-2">
                    <button
                        onClick={onSave}
                        type="button"
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Guardar
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoryModal;
