import {Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useSettingsContext } from "../../../../components/settings";
import { useLocales } from "../../../../locales";

const StatByStatusChart = ({ data }) => {
  const { themeMode } = useSettingsContext();
  const { translate, currentLang } = useLocales();

  // Enhanced color palette with more professional colors
  const COLORS = ['#2196F3', '#4CAF50', '#FFC107', '#FF5722', '#9C27B0', '#00BCD4', '#3F51B5', '#E91E63', '#009688', '#673AB7'];

  // Prepare data for pie chart
  const chartData = [
    ...data.statuses.map(item => ({
      name: item.name[currentLang.value],
      value: item.vehicle_count
    })),
    ...(data.empty_status ? [{
      name: translate('not_specified'),
      value: data.empty_status
    }] : [])
  ];

  return (
    <Card sx={{
        px: 3, 
        py: 3, 
        height: 500,
        boxShadow: (theme) => theme.customShadows.card,
        '& .recharts-wrapper': {
          margin: 'auto',
        },
      }}>
        <Typography 
        variant="h6" 
        sx={{
          color: 'text.primary',
          mb: 3,
          fontWeight: 600,
        }}
      >
        {translate('logistic-dashboard.stat_by_status')}
      </Typography>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                style={{
                  filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [
              `${value} ${translate('logistic-dashboard.pcs')}`, 
              name
            ]}
            contentStyle={{
              backgroundColor: themeMode === 'dark' ? '#333' : '#fff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          />
          {/* <Legend 
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span style={{ 
                color: themeMode === 'dark' ? '#fff' : '#666',
                fontSize: '0.875rem',
              }}>
                {value}
              </span>
            )}
          /> */}
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default StatByStatusChart;
