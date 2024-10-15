import React, { useState } from 'react';
import { FaPlusCircle } from "react-icons/fa";

interface Item {
    description: string;
    quantity: number;
    unitPrice: number;
}

interface ItemFormProps {
    items: Item[];
    setItems: (items: Item[]) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ items, setItems }) => {
    const [newItem, setNewItem] = useState<Item>({
        description: '',
        quantity: 1,
        unitPrice: 0,
    });

    // Actualizar el estado del nuevo item mientras se escribe en los inputs
    const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value;

        setNewItem((prevItem) => ({
            ...prevItem,
            [name]: parsedValue,
        }));
    };

    // Agregar un nuevo item a la lista
    const handleAddItem = () => {
        setItems([...items, newItem]); // Añadir el nuevo item a la lista
        setNewItem({
            description: '',
            quantity: 1,
            unitPrice: 0,
        }); // Reiniciar el estado del nuevo item
    };

    // Función para eliminar un item de la lista
    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className='pb-4 tex-xl'>Agregar Item</h2>
            {/* Inputs controlados para el nuevo item */}
            <div className='flex gap-3 pb-6 items-center'>
                <div className='flex flex-col w-full'>
                    <label className='text-black dark:text-white mb-3 '>Descripcion</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Descripción"
                        value={newItem.description}
                        onChange={handleNewItemChange}
                        className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black'
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <label className='text-black dark:text-white mb-3 '>Cantidad</label>
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Cantidad"
                        value={newItem.quantity}
                        onChange={handleNewItemChange}
                        className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black'
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <label className='text-black dark:text-white mb-3 '>Precio Unitario</label>
                    <input
                        type="number"
                        name="unitPrice"
                        placeholder="Precio Unitario"
                        value={newItem.unitPrice}
                        onChange={handleNewItemChange}
                        className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black'
                    />
                </div>
                <div className='flex w-full pt-8 pl-4'>
                    <button className='bg-primary flex items-center text-white p-2 rounded-lg' onClick={handleAddItem}><FaPlusCircle className='text-xl mr-1' />
                        Agregar Item</button>
                </div>
            </div>

            <h2 className='pb-4 tex-xl'>Items</h2>
            <table className='w-full table-auto'>
                <thead>
                    <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                        <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>Descripción</th>
                        <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>Cantidad</th>
                        <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>Precio Unitario</th>
                        <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className='hover:bg-gray-100'>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{item.description}</td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{item.quantity}</td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{item.unitPrice}</td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <button onClick={() => handleRemoveItem(index)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemForm;
