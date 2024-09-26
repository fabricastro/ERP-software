import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { Buttons } from "../../components/Buttons/Buttons"
import DefaultLayout from "../../layout/DefaultLayout"
import ProviderList from "./ProviderList"
export const Provider = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Proveedores" />
            <div className="flex flex-row gap-10">
                <Buttons title={'Agregar Proveedor'} to={'/provider/add'} />
            </div>
            <div className="py-10 flex flex-col gap-5">
                <h3>Listado de Proveedores</h3>
                <ProviderList />
            </div>
        </DefaultLayout>
    )
}