import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { Buttons } from "../../components/Buttons/Buttons"
import DefaultLayout from "../../layout/DefaultLayout"
import ArticleList from "./ArticleList"

export const Article = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Artículos" />
            <div className="flex flex-row gap-10">
                <Buttons title={'Agregar Artículo'} to={'/article/add_article'} />
            </div>
            <div className="py-10 flex flex-col gap-5">
                <h3>Listado de Clientes</h3>
                <ArticleList />
            </div>
        </DefaultLayout>
    )
}