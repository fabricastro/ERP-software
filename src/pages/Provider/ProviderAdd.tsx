import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { useState } from "react";
import { providerService } from "../../services/ProviderService";
import Alert from "../UiElements/Alerts";

export const ProviderAdd = () => {
    const [type, setType] = useState('Persona Humana');
    const [name, setName] = useState('');
    const [cuit, setCuit] = useState('');
    const [fiscalAddress, setFiscalAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [community, setCommunity] = useState('');
    const [province, setProvince] = useState('');
    const [country, setCountry] = useState('Argentina');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [web, setWeb] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    
    const agregarProveedor = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await providerService.addProvider({
                type,
                name,
                cuit,
                fiscalAddress,
                postalCode,
                community,
                province,
                country,
                phone,
                email,
                web,
            });

            setAlert({ type: 'success', message: 'Proveedor agregado con éxito' });
            setLoading(false);

            setType('Persona Humana');
            setName('');
            setCuit('');
            setFiscalAddress('');
            setPostalCode('');
            setCommunity('');
            setProvince('');
            setCountry('Argentina');
            setPhone('');
            setEmail('');
            setWeb('');

        } catch (error: any) {
            setLoading(false);
            setAlert({ type: 'error', message: 'Hubo un error al agregar el proveedor. Por favor, inténtalo de nuevo.' });
        }
    };


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar Proveedor" />
            <div className="flex flex-col gap-5.5 p-6.5">
                {loading && <p>Cargando...</p>}
                {alert && (
                    <Alert
                        type={alert.type}
                        title={alert.type === 'success' ? 'Éxito' : 'Error'}
                        message={alert.message}
                        onClose={() => setAlert(null)} // Cerrar la alerta
                    />
                )}
                <form onSubmit={agregarProveedor}>
                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Tipo de Proveedor:</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            <option value="Persona Humana">Persona Humana</option>
                            <option value="Persona Jurídica">Persona Jurídica</option>
                        </select>
                    </div>

                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Nombre:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className='mb-3 block text-black dark:text-white'>CUIT:</label>
                        <input
                            type="text"
                            value={cuit}
                            onChange={(e) => setCuit(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Dirección Fiscal:</label>
                        <input
                            type="text"
                            value={fiscalAddress}
                            onChange={(e) => setFiscalAddress(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Código Postal:</label>
                        <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Localidad/Comunidad:</label>
                        <input
                            type="text"
                            value={community}
                            onChange={(e) => setCommunity(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Provincia:</label>
                        <input
                            type="text"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className='mb-3 block text-black dark:text-white'>País:</label>
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Teléfono:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Correo Electrónico:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Página Web:</label>
                        <input
                            type="text"
                            value={web}
                            onChange={(e) => setWeb(e.target.value)}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <button className='mt-10 inline-flex items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10' type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Agregar Proveedor'}
                    </button>
                </form>
            </div>
        </DefaultLayout>
    );
};
