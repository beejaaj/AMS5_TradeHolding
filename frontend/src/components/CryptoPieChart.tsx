// components/CryptoPieChart.tsx
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartOptions, // Adicione esta linha
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const data = {
  labels: ['Bitcoin', 'Ethereum', 'XRP', 'Cardano', 'Dogecoin'],
  datasets: [
    {
      label: 'Participação de Mercado',
      data: [45, 25, 15, 10, 5],
      backgroundColor: [
        '#3A0CA3',
        '#9A4DFF',
        '#D1B3FF',
        '#6C44FF',
        '#CBA8FF',
      ],
      borderColor: '#0F0F0F',
      borderWidth: 2,
    },
  ],
};

const options: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: '#D1B3FF',
        font: {
          size: 12,
          family: 'sans-serif',
        },
      },
    },
    title: {
      display: true,
      text: 'Distribuição de Mercado Cripto (Lunaria)',
      color: '#FFFFFF',
      font: {
        size: 16,
        weight: 'bold',
      },
    },
  },
};

export default function CryptoPieChart() {
  return (
    <div className="max-w-xl w-full mx-auto mt-12 bg-[#1a1a1a] rounded-lg p-6 border border-highlight">
      <Pie data={data} options={options} />
    </div>
  );
}