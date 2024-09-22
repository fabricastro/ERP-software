import DefaultLayout from "../../layout/DefaultLayout"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import InvoiceGenerator from "./InvoiceGenerator"

export const Facturador = () => {
    
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Facturador" />
            <InvoiceGenerator/>
        </DefaultLayout>
    )
}