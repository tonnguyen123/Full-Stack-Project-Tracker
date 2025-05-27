// ProjectCompletionChart.tsx
import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
  } from 'recharts';
  
  interface ProjectCompletionChartProps {
    completion: number; // Value from 0 to 100
  }
  
  const ProjectCompletionChart = ({ completion }: ProjectCompletionChartProps) => {
    const fullCircle = [
      { name: 'Total', value: 100 },
    ];
  
    const completedData = [
      { name: 'Completed', value: completion },
    ];
  
    return (
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            data={fullCircle}
            startAngle={90}
            endAngle={-270}
          >
            {/* Background circle (light gray) */}
            <RadialBar
              dataKey="value"
              data={fullCircle}
              cornerRadius={10}
              fill="#e0e0e0"
            />
            {/* Completed part (green) */}
            <RadialBar
              dataKey="value"
              data={completedData}
              cornerRadius={10}
              fill="#4caf50"
            />
            {/* Center Text */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 24, fill: '#333' }}
            >
              {completion}%
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default ProjectCompletionChart;
  