import DefaultLayout from "../../layout/DefaultLayout";
import {Buttons} from "../../components/Buttons/Buttons";
import CustomerList from "./CustomerList";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { useTranslation } from "react-i18next";
export const Customer = () => {
    const {t} = useTranslation();
    return (
        <DefaultLayout>
            <Breadcrumb pageName={t('routes.customer')} />
        <div className="flex flex-row gap-10">
            <Buttons title={'Agregar Cliente'} to={'/customer/add'}/>
        </div>
        <div className="py-10 flex flex-col gap-5">
            <CustomerList/>
        </div>
        </DefaultLayout>
    );
};