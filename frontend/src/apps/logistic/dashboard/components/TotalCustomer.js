import { Card, Typography, Box } from "@mui/material";
import { useLocales } from "../../../../locales";

const TotalCustomer = ({total}) => {
  const { translate } = useLocales();

  return (
    <Card sx={{
      px: 3,
      py: 3,
      height: 140,
      boxShadow: (theme) => theme.customShadows.card,
    }}>
      <Typography 
        variant="h6" 
        sx={{
          color: 'text.primary',
          mb: 3,
          fontWeight: 600,
        }}
      >
        {translate('logistic-dashboard.total_customers')}
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 2 
      }}>
        {/* <LocalShippingIcon 
          sx={{ 
            fontSize: 48,
            color: 'primary.main'
          }} 
        /> */}
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          {total} {translate('logistic-dashboard.pcs')}
        </Typography>
      </Box>
    </Card>
  );
};

export default TotalCustomer;
