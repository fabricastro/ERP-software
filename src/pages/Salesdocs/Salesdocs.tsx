import DefaultLayout from "../../layout/DefaultLayout"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { useTranslation } from "react-i18next"
import { Buttons } from "../../components/Buttons/Buttons"
import SalesDocsList from './SalesdocsList';

interface SalesdocsAddProps{
    typeSalesdocs: 'budget' | 'bill'
  }

export const Salesdocs: React.FC<SalesdocsAddProps> = ({ typeSalesdocs }) => {
    const { t } = useTranslation();
    const buttonTitle = typeSalesdocs === 'budget' ? 'Agregar Presupuesto' : 'Agregar Factura';
    const buttonRoute = typeSalesdocs === 'budget' ? '/budget/add_budget' : '/bill/add_bill';
    const breadcrumbTitle = typeSalesdocs === 'budget' ? 'Budget' : 'Bill';

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t(`routes.${breadcrumbTitle.toLowerCase()}`)} />
            <div className="flex flex-row gap-10">
                <Buttons title={buttonTitle} to={buttonRoute} />
            </div>
            <div className="py-10 flex flex-col gap-5">
                <SalesDocsList typeSalesdocs={typeSalesdocs} />
            </div>
        </DefaultLayout>
    );
}