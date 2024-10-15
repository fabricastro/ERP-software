import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import DefaultLayout from '../../layout/DefaultLayout';
import ChartOne from './../../components/Charts/ChartOne';

const ECommerce: React.FC = () => {
  return (
    <DefaultLayout>
      <h1 className="text-title-md2 font-semibold text-black dark:text-white mb-5">Principal</h1>
      <div className='flex flex-row gap-10 w-full'>
        <CardDataStats title="Presupuestado" total="22.000.000" rate="10%" children={<h1>P</h1>} />
        <CardDataStats title="Facturado" total="10.000.000" rate="60%" children={<h1>F</h1>} />
        <CardDataStats title="Articulos Vendidos" total="582" rate="30%" children={<h1>A</h1>} />
        <CardDataStats title="Nuevos Clientes" total="23" rate="10%" children={<h1>C</h1>} />
      </div>
      <div className='mt-5'>
        <ChartOne/>
      </div>
    </DefaultLayout>
  );
};

export default ECommerce;
