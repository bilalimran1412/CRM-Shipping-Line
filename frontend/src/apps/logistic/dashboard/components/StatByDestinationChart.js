import { useTheme } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocales } from "../../../../locales";
import { useSettingsContext } from "../../../../components/settings";

const StatByDestinationChart = ({ data }) => {
  const theme = useTheme();
  const { translate, currentLang } = useLocales();
  const { themeMode } = useSettingsContext();

  // Transform data for the chart
  const chartData = [
    ...data.destinations.map(item => {
        return {
      name: `${item.country?.[currentLang.value]}, ${item.city?.[currentLang.value]}`,
      delivered: item.delivered,
      not_delivered: item.not_delivered
    }}),
    ...(data.unassociated_vehicles.total !== 0 ? [{
      name: translate('not_specified'),
      delivered: data.unassociated_vehicles.delivered,
      not_delivered: data.unassociated_vehicles.not_delivered
    }] : [])
  ];

  return (
    <Card sx={{ p: 3, height: 500 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 2 }}>
        {translate('logistic-dashboard.stat_by_destination')}
      </Typography>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            tick={false}
            interval={0}
          />
          <YAxis tick={{ fill: theme.palette.text.primary }} />
          <Tooltip
            contentStyle={{
              backgroundColor: themeMode === 'dark' ? theme.palette.grey[800] : theme.palette.common.white,
              color: theme.palette.text.primary,
              borderRadius: 8,
              border: `1px solid ${theme.palette.divider}`,
            }}
          />
          <Legend />
          <Bar 
            dataKey="delivered" 
            name={translate('logistic-dashboard.delivered')}
            fill={theme.palette.success.main} 
          />
          <Bar 
            dataKey="not_delivered" 
            name={translate('logistic-dashboard.not_delivered')}
            fill={theme.palette.error.main} 
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default StatByDestinationChart;
