import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { Buttons } from "../../components/Buttons/Buttons"
import DefaultLayout from "../../layout/DefaultLayout"
import ArticleList from "./ArticleList";
import { TbCategoryFilled } from "react-icons/tb";

export const Article = () => {
    return (
        <DefaultLayout>
                <Breadcrumb pageName="Artículos" />
                <div className="flex flex-col sm:flex-row gap-4">
                    <Buttons title={'Agregar Artículo'} to={'/article/add'} />
                    <Buttons title={'Gestionar Categorías'} to={'/article/category'} icon={<TbCategoryFilled />} bgColor="bg-[#4285F4]" />
                </div>
                <div className="py-10 flex flex-col gap-5">
                    <ArticleList />
                </div>
        </DefaultLayout>
    )
}