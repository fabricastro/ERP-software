import React from 'react';

interface Column {
  key: string;
  label: string;
}

interface TableProps {
  data: any[];
  columns: Column[];
  actions?: (item: any) => React.ReactNode;
}

const TableThree: React.FC<TableProps> = ({ data, columns, actions }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="py-4 px-4 font-medium text-black dark:text-white">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {columns.map((column) => (
                  <td key={column.key} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {item[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      {actions(item)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
