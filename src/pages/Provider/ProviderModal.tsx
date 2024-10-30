import React, { useEffect } from 'react';
import FormInput from "../../components/Input/input";
import { provinces } from "../../utils/provinces";

interface ProviderModalProps {
    type: string;
    setType: (value: string) => void;
    name: string;
    setName: (value: string) => void;
    cuit: string;
    setCuit: (value: string) => void;
    fiscalAddress: string;
    setFiscalAddress: (value: string) => void;
    postalCode: string;
    setPostalCode: (value: string) => void;
    community: string;
    setCommunity: (value: string) => void;
    province: string;
    setProvince: (value: string) => void;
    country: string;
    setCountry: (value: string) => void;
    phone: string;
    setPhone: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    web: string;
    setWeb: (value: string) => void;
    disabled?: boolean;
    onSave: () => void;
}

const ProviderModal: React.FC<ProviderModalProps> = ({
    type,
    setType,
    name,
    setName,
    cuit,
    setCuit,
    fiscalAddress,
    setFiscalAddress,
    postalCode,
    setPostalCode,
    community,
    setCommunity,
    province,
    setProvince,
    country,
    setCountry,
    phone,
    setPhone,
    email,
    setEmail,
    web,
    setWeb,
    disabled = false,
    onSave
}) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                onSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onSave]);
    
    return (
        <div className="flex flex-col sm:grid gap-0 sm:gap-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            <FormInput
                label="Tipo de Cliente"
                type="select"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={["Persona Humana", "Persona Jurídica"]}
                disabled={disabled}
                required
            />
            <FormInput
                label="Nombre y apellido"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={disabled}
                required
            />
            <FormInput
                label="CUIT"
                type="text"
                id="cuit"
                value={cuit}
                onChange={(e) => setCuit(e.target.value)}
                disabled={disabled}
                required
            />
            <FormInput
                label="Dirección Fiscal"
                type="text"
                id="fiscalAddress"
                value={fiscalAddress}
                onChange={(e) => setFiscalAddress(e.target.value)}
                disabled={disabled}
                required
            />
            <FormInput
                label="Código Postal"
                type="text"
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                disabled={disabled}
                required
            />
            <FormInput
                label="Localidad/Comunidad"
                type="text"
                id="community"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                disabled={disabled}
                required
            />
            <FormInput
                label="Provincia"
                type="text"
                id="province"
                value={province}
                options={provinces}
                onChange={(e) => setProvince(e.target.value)}
                disabled={disabled}
                required
            />
            <FormInput
                label="País"
                type="text"
                id="country"
                value={country}
                options={['Argentina']}
                onChange={(e) => setCountry(e.target.value)}
                disabled={disabled}
                required
            />
            <FormInput
                label="Teléfono"
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={disabled}
                required
            />
            <FormInput
                label="Correo Electrónico"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={disabled}
                required
            />
            <FormInput
                label="Página Web"
                type="text"
                id="web"
                value={web}
                onChange={(e) => setWeb(e.target.value)}
                disabled={disabled}
            />
            <div className=" col-span-2">
                <button
                    onClick={onSave}
                    type='button'
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Guardar
                </button>
            </div>
        </div>
    );
};

export default ProviderModal;
