import DefaultLayout from "../../layout/DefaultLayout"
import InvoiceGenerator from "./InvoiceGenerator"
import Breadcrumb from './../../components/Breadcrumbs/Breadcrumb';
import { useTranslation } from 'react-i18next';
export const SalesdocsAdd = () => {
    const { t } = useTranslation();
    return (
        <DefaultLayout>
            <Breadcrumb pageName={t('routes.add_salesdocs')} />
            <InvoiceGenerator />
        </DefaultLayout>
    )
}