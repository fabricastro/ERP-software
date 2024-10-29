import DefaultLayout from "../../layout/DefaultLayout"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { useTranslation } from "react-i18next"
import { Buttons } from "../../components/Buttons/Buttons"
import SalesDocsList from './SalesdocsList';

export const Salesdocs = () => {
    const { t } = useTranslation();
    return (
        <DefaultLayout>
            <Breadcrumb pageName={t('routes.salesdocs')} />
            <div className="flex flex-row gap-10">
                <Buttons title={'Agregar Presupuesto'} to={'/salesdocs/add_salesdocs'} />
            </div>
            <div className="py-10 flex flex-col gap-5">
                <SalesDocsList />
            </div>
        </DefaultLayout>
    )
}