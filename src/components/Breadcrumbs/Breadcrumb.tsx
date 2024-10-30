import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Buttons } from '../Buttons/Buttons';
import { FaArrowLeft } from 'react-icons/fa';

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const getReturnPath = () => {
    if (pathnames.length >= 1) {
      return `/${pathnames.slice(0, 1).join('/')}`;
    }
    return '/';
  };

  return (
    <div className="mb-6 flex flex-row gap-3 items-center justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        {pathnames.length > 1 ? (
          <Buttons
            title="Volver"
            to={() => navigate(getReturnPath())}
            icon={<FaArrowLeft />}
          />
          ) : (
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" to="/">
                {t('routes.dashboard')} /
              </Link>
            </li>

            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              
              const translatedValue = t(`routes.${value}`, value);

              return (
                <li key={to}>
                  <Link className="font-medium" to={to}>
                    {translatedValue} {index < pathnames.length - 1 ? '/' : ''}
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </nav>
    </div>
  );
};

export default Breadcrumb;
