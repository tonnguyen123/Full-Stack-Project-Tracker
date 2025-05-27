// ProgressChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
import { TaskProgress } from '../types';

interface ProgressChartProps {
  data: TaskProgress[];
}

const ProgressChart = ({ data }: ProgressChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart layout="vertical" data={data} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
        <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
        <YAxis dataKey="taskName" type="category" />
        <Tooltip formatter={(value: number) => `${value}%`} />
        <Legend />
        <Bar dataKey="expectation" fill="#33c4ff" name="Expectation" />
        <Bar dataKey="progress" fill="#93ff33" name="Progress">
          <LabelList dataKey="progress" position="insideRight" formatter={(value: number) => `${value}%`} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
