import DefaultLayout from "../../layout/DefaultLayout"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import InvoiceGenerator from "./InvoiceGenerator"
import { useTranslation } from "react-i18next"

export const Salesdocs = () => {
    const {t} = useTranslation();
    return (
        <DefaultLayout>
            <Breadcrumb pageName={t('routes.salesdocs')} />
            <InvoiceGenerator/>
        </DefaultLayout>
    )
}