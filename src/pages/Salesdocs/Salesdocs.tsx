import DefaultLayout from "../../layout/DefaultLayout"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { useTranslation } from "react-i18next"
import { Buttons } from "../../components/Buttons/Buttons"

export const Salesdocs = () => {
    const { t } = useTranslation();
    return (
        <DefaultLayout>
            <Breadcrumb pageName={t('routes.salesdocs')} />
            <div className="flex flex-row gap-10">
                <Buttons title={'Agregar Presupuesto'} to={'/salesdocs/add_salesdocs'} />
            </div>
        </DefaultLayout>
    )
}