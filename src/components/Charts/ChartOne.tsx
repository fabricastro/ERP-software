import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartOneProps {
  budgets: number[];
  bills: number[];
  months: string[];
}

const ChartOne: React.FC<ChartOneProps> = ({ budgets, bills, months }) => {
  const fullYearMonths = [
    '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
    '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
    '2025-01'
  ];

  const alignedBudgets = fullYearMonths.map(month => {
    const index = months.indexOf(month);
    return index !== -1 ? budgets[index] : 0;
  });

  const alignedBills = fullYearMonths.map(month => {
    const index = months.indexOf(month);
    return index !== -1 ? bills[index] : 0;
  });

  const [chartKey, setChartKey] = useState(0);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3', '#80CAEE'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: 6,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: fullYearMonths,
      labels: {
        formatter: (val) => new Date(val + '-01').toLocaleString('default', { month: 'short' }),
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: Math.max(...alignedBudgets, ...alignedBills) * 1.2,
    },
    tooltip: {
      enabled: true,
      x: {
        format: 'MMM yyyy',
      },
      y: {
        formatter: (value) => `$${value.toFixed(2)}`,
      },
    },
  };

  const series = [
    { name: 'Total Presupuestado', data: alignedBudgets },
    { name: 'Total Facturado', data: alignedBills },
  ];

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Cambia `key` para forzar el renderizado del gráfico solo al volver a la pestaña activa
        setChartKey(prevKey => prevKey + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Presupuestado</p>
              <p className="text-sm font-medium">Año 2024</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Facturado</p>
              <p className="text-sm font-medium">Año 2024</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            key={chartKey}  // Se actualiza solo en cambios de pestaña
            options={options}
            series={series}
            type="area"
            height={500}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
