import { Card,Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { useLocales } from "../../../../locales";
import { useSettingsContext } from "../../../../components/settings";

const StatByUserVehicleChart = ({ data }) => {
  const { translate } = useLocales();
  const { themeMode } = useSettingsContext();

  // Prepare data for chart
  const chartData = [
    ...data.customers.map(item => ({
      name: item.full_name,
      delivered: item.delivered,
      not_delivered: item.not_delivered,
    })),
    ...(data.unassociated_vehicles.total !== 0 ? [{
      name: translate('not_specified'),
      delivered: data.unassociated_vehicles.delivered,
      not_delivered: data.unassociated_vehicles.not_delivered,
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
          mb: 2,
          fontWeight: 600,
        }}
      >
        {translate('logistic-dashboard.stat_by_user_vehicle')}
      </Typography>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            tick={false}
            interval={0}
          />
          <YAxis />
          <Tooltip 
            contentStyle={{
              backgroundColor: themeMode === 'dark' ? '#333' : '#fff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          />
          <Legend />
          <Line 
            type="monotone"
            dataKey="delivered" 
            name={translate('logistic-dashboard.delivered')}
            stroke="#2e7d32"
          />
          <Line 
            type="monotone"
            dataKey="not_delivered" 
            name={translate('logistic-dashboard.not_delivered')}
            stroke="#d32f2f"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default StatByUserVehicleChart;
