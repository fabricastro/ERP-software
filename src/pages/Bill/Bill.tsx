import DefaultLayout from "../../layout/DefaultLayout"
import { useTranslation } from "react-i18next";
import Breadcrumb from './../../components/Breadcrumbs/Breadcrumb';
export const Bill = () => {
    const {t} = useTranslation();
    return (
        <DefaultLayout>
            <Breadcrumb pageName={t('routes.bill')}/>
        </DefaultLayout>
    )
}