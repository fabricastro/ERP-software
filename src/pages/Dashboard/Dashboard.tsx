import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import DefaultLayout from '../../layout/DefaultLayout';
import withWelcomeModal from '../../hoc/withWelcomeModal';
import { FaBoxes, FaMoneyBill, FaUsers } from 'react-icons/fa';
import { RiBillFill } from "react-icons/ri";
import { dashboardService } from '../../services/DashboardService';
import ChartOne from '../../components/Charts/ChartOne';

const Dashboard: React.FC = () => {
  const [amountBudget, setAmountBudget] = useState<number>(0);
  const [amountBill, setAmountBill] = useState<number>(0);
  const [quantityArticles, setQuantityArticles] = useState<number>(0);
  const [quantityCustomers, setQuantityCustomers] = useState<number>(0);
  const [chartOneData, setChartOneData] = useState<{ budgets: number[]; bills: number[]; months: string[] }>({
    budgets: [],
    bills: [],
    months: []
  });

  const getDashboardData = () => {
    dashboardService.getDashboardData().then((res) => {
      setAmountBudget(res.data.amountBudget);
      setAmountBill(res.data.amountBill);
      setQuantityArticles(res.data.quantityArticles);
      setQuantityCustomers(res.data.quantityCustomers);
      
      if (res.data.chartOneData) {
        setChartOneData({
          budgets: res.data.chartOneData.budgets || [],
          bills: res.data.chartOneData.bills || [],
          months: res.data.chartOneData.months || [],
        });
      }
    });
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DefaultLayout>
      <h1 className="text-title-md2 font-semibold text-black dark:text-white mb-5">Principal</h1>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full'>
        <CardDataStats 
          title="Presupuestado" 
          total={new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amountBudget || 0)} 
          rate="" 
          children={<FaMoneyBill className='text-2xl text-primary dark:text-white' />} 
        />
        <CardDataStats 
          title="Facturado" 
          total={new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amountBill || 0)} 
          rate="" 
          children={<RiBillFill className='text-2xl text-primary dark:text-white' />} 
        />
        <CardDataStats title="Artículos vendidos" total={quantityArticles?.toString()} rate="" children={<FaBoxes className='text-2xl text-primary dark:text-white' />} />
        <CardDataStats title="Clientes" total={quantityCustomers?.toString()} rate="" children={<FaUsers className='text-2xl text-primary dark:text-white' />} />
      </div>
      <div className='mt-5'>
        {chartOneData.budgets.length > 0 && chartOneData.bills.length > 0 && (
          <ChartOne budgets={chartOneData.budgets} bills={chartOneData.bills} months={chartOneData.months} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default withWelcomeModal(Dashboard);
