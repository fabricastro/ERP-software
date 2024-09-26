import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { Buttons } from "../../components/Buttons/Buttons"
import DefaultLayout from "../../layout/DefaultLayout"

export const Product = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Artículos" />
            <div className="flex flex-row gap-10">
                <Buttons title={'Agregar Producto'} to={'/product/add'} />
            </div>
            <div className="py-10 flex flex-col gap-5">
            <h3>Listado de Clientes</h3>
            {/* <CustomerList/> */}
        </div>
        </DefaultLayout>
    )
}