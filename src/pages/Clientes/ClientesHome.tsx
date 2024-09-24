import DefaultLayout from "../../layout/DefaultLayout";
import {Buttons} from "../../components/Buttons/Buttons";
export const ClientesHome = () => {
    return (
        <DefaultLayout>
            <h1 className="pb-10">Clientes</h1>
        <div className="flex flex-row gap-10">
            <Buttons title={'Agregar Cliente'} to={'/clientes/agregar'}/>
            <Buttons title={'Listar Clientes'}/>
        </div>
        </DefaultLayout>
    );
};