import React, { useState, useEffect } from 'react';
import { FaPlusCircle } from "react-icons/fa";
import { articleService } from '../../services/ArticleService';
import FormInput from './../../components/Input/input';

interface Item {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    iva: number;
    subtotal: number;
}

interface ItemFormProps {
    items: Item[];
    setItems: (items: Item[]) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ items, setItems }) => {
    const [newItem, setNewItem] = useState<Item>({
        name: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        iva: 21,
        subtotal: 0,
    });
    const [articles, setArticles] = useState<any[]>([]);
    const [articleID, setArticleID] = useState<number | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const articlesData = await articleService.getAll();
                setArticles(articlesData);
            } catch (error) {
                console.error('Error al cargar los artículos:', error);
            }
        };
        fetchArticles();
    }, []);

    const handleArticleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedArticleId = Number(e.target.value);
        setArticleID(selectedArticleId);

        const selectedArticle = articles.find(article => article.id === selectedArticleId);
        if (selectedArticle) {
            setNewItem({
                ...newItem,
                name: selectedArticle.name,
                description: selectedArticle.name,
                unitPrice: selectedArticle.unitPrice,
                iva: selectedArticle.iva || 21,
                discount: selectedArticle.discount || 0,
            });
        }
    };

    const handleNewItemChange = (field: keyof Item) => (value: string | number) => {
        setNewItem((prevItem) => ({
            ...prevItem,
            [field]: value,
        }));
    };

    const calculateSubtotal = (item: Item) => {
        const subtotalSinIVA = item.unitPrice * item.quantity;
        const subtotalConBonificacion = subtotalSinIVA - (subtotalSinIVA * (item.discount / 100));
        const subtotalConIVA = subtotalConBonificacion * (1 + item.iva / 100);
        return subtotalConIVA;
    };

    const handleAddItem = () => {
        if (!newItem.description.trim() || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
            return;
        }

        const updatedItem = {
            ...newItem,
            subtotal: calculateSubtotal(newItem),
        };

        setItems([...items, updatedItem]);

        setNewItem({
            name: '',
            description: '',
            quantity: 1,
            unitPrice: 0,
            discount: 0,
            iva: 21,
            subtotal: 0,
        });
        setArticleID(null);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2 className="pb-4 text-xl">Agregar Item</h2>
            <div className="flex flex-wrap gap-3 pb-6 items-center">
                <div className="flex flex-col w-full md:w-[45%] lg:w-[30%]">
                    <FormInput
                        label="Selecciona un artículo:"
                        type="select"
                        id="article"
                        value={articleID || 'No existen artículos'}
                        options={articles.map((article) => ({
                            label: article.name,
                            value: article.id
                        }))}
                        onChange={(e) => handleArticleChange(e as React.ChangeEvent<HTMLSelectElement>)}
                        disabled={articles.length === 0}
                    />
                </div>
                <div className="flex flex-col w-full md:w-[45%] lg:w-[30%]">
                    <FormInput
                        id="description"
                        label="O Ingrese Manualmente:"
                        name="description"
                        value={newItem.description}
                        onChange={(e) => handleNewItemChange('description')(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>
                <div className="flex flex-col w-[48%] md:w-[20%] lg:w-[10%]">
                    <FormInput
                        id="quantity"
                        label="Cantidad"
                        type="number"
                        name="quantity"
                        value={newItem.quantity}
                        onChange={(e) => handleNewItemChange('quantity')(parseFloat(e.target.value))}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>
                <div className="flex flex-col w-[48%] md:w-[20%] lg:w-[15%]">
                    <FormInput
                        id="unitPrice"
                        label="Precio Unitario"
                        type="number"
                        name="unitPrice"
                        value={newItem.unitPrice}
                        onChange={(e) => handleNewItemChange('unitPrice')(parseFloat(e.target.value))}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>
                <div className="flex flex-col w-[48%] md:w-[15%] lg:w-[10%]">
                    <FormInput
                        id="discount"
                        label="Bonif %"
                        type="number"
                        name="discount"
                        value={newItem.discount}
                        onChange={(e) => handleNewItemChange('discount')(parseFloat(e.target.value))}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>
                <div className="flex flex-col w-[48%] md:w-[15%] lg:w-[10%]">
                    <FormInput
                        id="iva"
                        label="IVA %"
                        type="number"
                        name="iva"
                        value={newItem.iva}
                        onChange={(e) => handleNewItemChange('iva')(parseFloat(e.target.value))}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>
                <div className="flex w-full md:w-auto lg:w-[15%] pl-4 mt-2 md:mt-0">
                    <button
                        className="bg-primary flex items-center text-white rounded-lg h-[52px] px-2 hover:bg-opacity-90 transition-all w-full md:w-auto"
                        onClick={handleAddItem}
                    >
                        <FaPlusCircle className="text-xl mr-1" /> Agregar Item
                    </button>
                </div>
            </div>

            <h2 className="pb-4 text-xl">Items</h2>
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Descripción</th>
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Cantidad</th>
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Precio Unitario sin IVA</th>
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Bonif %</th>
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">IVA %</th>
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Subtotal</th>
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(items) && items.length > 0 ? (
                            items.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{item.description}</td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{item.quantity}</td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{item.unitPrice}</td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{item.discount}</td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{item.iva}</td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{Number(item.subtotal ?? 0).toFixed(2)}</td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <button onClick={() => handleRemoveItem(index)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-5">No hay ítems agregados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ItemForm;
