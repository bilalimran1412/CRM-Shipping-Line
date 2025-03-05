import {useState} from 'react';
// form
import {useFormContext, useFieldArray} from 'react-hook-form';
// @mui
import {Box, Stack, Divider, Typography, Tabs, Tab} from '@mui/material';
// components
import {useLocales} from "locales";
import MultiFileUpload from "components/upload/MultiFileUpload";
import PhotoThumb from "./PhotoThumb";


export default function VehiclePhoto({formData}) {
  const {control, setValue, watch, resetField} = useFormContext();
  const [category, setCategory] = useState(false)
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'photos',
    keyName: '_field_id',
  });
  const {translate, currentLang} = useLocales()

  const handleRemove = (file, index) => {
    const fileIndex = fields.findIndex(item => item._field_id === file._field_id)
    remove(fileIndex);
  };

  const onFileUpload = (file) => {
    append({
      category,
      file,
    })
  }
  const selectCategory = (
    <Stack
      spacing={5}
      alignItems="center"
      justifyContent="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        width: 1,
        textAlign: {
          xs: 'center',
          md: 'left',
        },
      }}
    >

      <Typography variant="subtitle2" sx={{color: 'text.disabled'}}>
        {translate('vehicle.form.photos.select_category')}
      </Typography>

    </Stack>
  )
  return (
    <Box>
      <Typography variant="h6" sx={{color: 'text.disabled', mb: 2}}>
        {translate('vehicle.form.photos.title')}
      </Typography>

      <Stack divider={<Divider flexItem sx={{borderStyle: 'dashed'}}/>} spacing={2}>
        <Tabs value={category} onChange={(event, newValue) => setCategory(newValue)}>
          {formData?.vehicle_photo_category?.map?.((tab) => (
            <Tab key={tab.id} label={tab.name[currentLang.value]} value={tab.id}/>
          ))}
        </Tabs>

        {category ?
          <MultiFileUpload type={'vehicle_photo'} onFileUpload={onFileUpload} accept={{'image/*': []}}/>
          : selectCategory
        }
        <div>
          <PhotoThumb files={fields.filter(item => item.category == category)} onRemove={handleRemove}/>
        </div>
      </Stack>


    </Box>
  );
}
