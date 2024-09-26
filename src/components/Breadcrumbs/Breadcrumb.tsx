import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const location = useLocation();
  const { t } = useTranslation();

 
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
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
      </nav>
    </div>
  );
};

export default Breadcrumb;
