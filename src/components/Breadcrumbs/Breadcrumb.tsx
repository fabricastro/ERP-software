import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const location = useLocation();
  
  // Divide la ruta actual en segmentos
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
              Dashboard /
            </Link>
          </li>

          {/* Mapeo de rutas anteriores */}
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

            return (
              <li key={to}>
                <Link className="font-medium" to={to}>
                  {value.charAt(0).toUpperCase() + value.slice(1)} {index < pathnames.length - 1 ? '/' : ''}
                </Link>
              </li>
            );
          })}

          {/* Página actual */}
          {/* <li className="font-medium text-primary">{pageName}</li> */}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
