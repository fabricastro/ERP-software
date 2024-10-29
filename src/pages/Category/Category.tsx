import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import CategoryList from "./CategoryList";

export const Category = () => {
    return(
        <DefaultLayout>
            <Breadcrumb pageName="Categorías" />
            <div className="flex flex-col">
                <CategoryList />
            </div>
        </DefaultLayout>
    )
};