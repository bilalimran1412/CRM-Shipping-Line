// form
import {useFieldArray, useFormContext} from 'react-hook-form';
// @mui
import {Box, Button, Divider, Stack, Typography} from '@mui/material';
// components
import Iconify from 'components/iconify';
import {useLocales} from "locales";
import {IconButtonAnimate} from "components/animate";
import RHFDateTimeField from "components/hook-form/RHFDateTimeField";
import {RHFAutocomplete} from "components/hook-form";

export default function DeliveryHistory({formData}) {
  const {control, setValue, watch, getValues, resetField} = useFormContext();

  const {fields, append, remove, replace} = useFieldArray({
    control,
    name: 'history',
    keyName: '_field_id',
  });
  const {translate, currentLang} = useLocales()

  const handleAdd = () => {
    append({});
  };

  const handleRemove = (index) => {
    remove(index);
  };
  return (
    <Box>
      <Stack direction="row" alignItems="center" sx={{mb: 3}}>
        <Box sx={{flexGrow: 1}}>
          <Typography variant="h6" sx={{color: 'text.disabled'}}>
            {translate('vehicle.form.history.title')}
          </Typography>
        </Box>
      </Stack>
      <Stack divider={<Divider flexItem sx={{borderStyle: 'dashed'}}/>} spacing={2}>
        {fields.map((item, index) => (
          <Stack key={item._field_id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2} sx={{width: 1}}>
              <RHFAutocomplete
                name={`history.${index}.status`}
                label={translate('vehicle.form.history.status')}
                options={formData?.status?.map?.(({id, name}) => ({
                  label: name[currentLang.value],
                  value: id
                }))}
                fullWidth
                filterSelectedOptions
                size={'small'}
              />
              <RHFDateTimeField
                size={'small'}
                name={`history.${index}.datetime`}
                label={translate('vehicle.form.history.datetime')}
              />

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
