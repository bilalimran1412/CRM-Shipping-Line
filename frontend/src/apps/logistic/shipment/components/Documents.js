// form
import {useFormContext, useFieldArray} from 'react-hook-form';
// @mui
import {Box, Stack, Button, Divider, Typography, Grid} from '@mui/material';
// components
import Iconify from 'components/iconify';
import {RHFTextField} from 'components/hook-form';
import {useLocales} from "locales";
import {IconButtonAnimate} from "components/animate";
import RHFFileUploadField from "components/hook-form/RHFFileUploadField";


export default function Documents() {
  const {control, setValue, watch, resetField} = useFormContext();

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'documents',
    keyName: '_field_id',
  });
  const {translate} = useLocales()
  const values = watch();


  const handleAdd = () => {
    append({});
  };

  const handleRemove = (index) => {
    remove(index);
  };


  return (
    <Box>
      <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
        {translate('shipment.form.documents.title')}
      </Typography>

      <Stack divider={<Divider flexItem sx={{borderStyle: 'dashed'}}/>} spacing={2}>
        {fields.map((item, index) => (
          <Stack key={item._field_id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2} sx={{width: 1}}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    size="small"
                    name={`documents.${index}.name`}
                    label={translate('shipment.form.documents.name')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFFileUploadField
                    size="small"
                    name={`documents.${index}.file`}
                    type="shipment_document"
                    label={translate('shipment.form.documents.file')}
                  />
                </Grid>
              </Grid>

              <Box sx={{pt: 0.4}}>
                <IconButtonAnimate color="error" onClick={() => handleRemove(index)}>
                  <Iconify fontSize="inherit" icon="eva:trash-2-outline"/>
                </IconButtonAnimate>
              </Box>
            </Stack>

          </Stack>
        ))}
      </Stack>

      <Divider sx={{my: 2, borderStyle: 'dashed'}}/>

      <Stack
        spacing={2}
        direction={{xs: 'column-reverse', md: 'row'}}
        alignItems={{xs: 'flex-start', md: 'center'}}
      >
        <Button
          size="small"
          startIcon={<Iconify icon="eva:plus-fill"/>}
          onClick={handleAdd}
          sx={{flexShrink: 0}}
        >
          {translate('add')}
        </Button>

      </Stack>

    </Box>
  );
}
