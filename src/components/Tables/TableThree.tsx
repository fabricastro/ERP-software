import React from 'react';
import { LuSearchX } from "react-icons/lu";

interface Column {
  key: string;
  label: string;
  bgColor?: string;
}

interface TableProps {
  data: any[];
  columns: Column[];
  actions?: (item: any) => React.ReactNode;
}
function getTextColor(backgroundColor) {
  // Extrae el valor RGB del color de fondo
  const color = backgroundColor.substring(1); // omitir '#'
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  // Calcular el brillo percibido
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  // Si el fondo es claro, usa texto oscuro, si es oscuro, usa texto claro
  return brightness > 155 ? '#000' : '#fff';
}

const TableThree: React.FC<TableProps> = ({ data, columns, actions }) => {
  const getValue = (item: any, key?: string) => {
    return key?.split('.').reduce((acc, part) => acc && acc[part], item);
  };
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <LuSearchX className="text-6xl text-gray-400 mb-4" />
            <p className="text-lg text-gray-500">No se encontraron items</p>
          </div>
        ) : (
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
                      {column.bgColor ? (
                        <span
                          style={{
                            backgroundColor: getValue(item, column.bgColor),
                            color: getTextColor(getValue(item, column.bgColor)),
                          }}
                          className="inline-block px-3 font-bold py-1 rounded-full text-sm"
                        >
                          {getValue(item, column.key)}
                        </span>
                      ) : (
                        getValue(item, column.key)
                      )}
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
        )}
      </div>
    </div>
  );
};

export default TableThree;
