import { useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

// components
import FormProvider, { RHFAutocomplete, RHFTextField, RHFDateField } from 'components/hook-form'; // Ensure RHFDateTimeField is imported
import { useLocales } from "locales";
import { createValidator } from "../validators";
// ----------------------------------------------------------------------

export default function CreateForm({ isEdit = false, data, formData, onSubmit, isSubmitting }) {
  const { translate, currentLang } = useLocales();
  const methods = useForm({
    resolver: yupResolver(createValidator(translate)),
    defaultValues: data,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    getValues
  } = methods;

  useEffect(() => {
    if (isEdit && data) {
      reset(data);
    }
    if (!isEdit) {
      reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, data]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'text.disabled', mb: 2 }}>
                  {translate('pricing.form.main_data')}
                </Typography>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  <RHFTextField
                    size="small"
                    name={`name`}
                    label={translate('pricing.form.type_name')}
                  />
                  <RHFDateField
                    size={'small'}
                    name={`date`}
                    label={translate('pricing.form.date')}
                  />
                  <RHFTextField
                    size="small"
                    name={`file`}
                    label={translate('pricing.form.file')}
                    type="file"
                  />
                </Box>
                <Stack alignItems="flex-start" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? translate('pricing.form.create_button') : translate('pricing.form.edit_button')}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    </FormProvider>
  );
}
