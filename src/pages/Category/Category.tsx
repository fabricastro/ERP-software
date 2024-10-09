import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Buttons } from "../../components/Buttons/Buttons";
import DefaultLayout from "../../layout/DefaultLayout";

export const Category = () => {
    return(
        <DefaultLayout>
            <Breadcrumb pageName="Categorías" />
            <div className="flex flex-row gap-10">
                <Buttons title={'Agregar Categoria'} to={'/category/add_category'} />
            </div>
            <div className="py-10 flex flex-col gap-5">
                <h3>Listado de Categorías</h3>
                {/* <CategoryList /> */}
            </div>
        </DefaultLayout>
    )
};