// @mui
import {useState} from "react";
import {Box, Typography, Tabs, Tab, Stack} from '@mui/material';
import {useLocales} from "locales";
// @mui
import PhotoThumb from "./PhotoThumb";
import _ from 'lodash'

export default function PhotoView({data}) {
  const {translate, currentLang} = useLocales()
  const categories = data.map(photo => photo.category);
  const uniqueCategories = _.uniqBy(categories, 'id');
  const [category, setCategory] = useState(uniqueCategories?.[0]?.id || false)
  const emptyPhoto = (
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
        {translate('vehicle.view.empty_photos')}
      </Typography>

    </Stack>
  )
  return (
    <div>
      <Typography variant="h6" sx={{color: 'text.disabled'}}>
        {translate('vehicle.view.photos')}
      </Typography>


      <Box sx={{mt: 0}}>
        {data.length === 0 ? emptyPhoto :
          <>
            <Tabs value={category} sx={{ml: 1}} onChange={(event, newValue) => setCategory(newValue)}>
              {uniqueCategories.map(item =>
                <Tab label={item.name[currentLang.value]} key={item.id} value={item.id}/>
              )}
            </Tabs>
            <Box sx={{mt: 2}}>
              <PhotoThumb files={data.filter(item => item.category?.id === category)}/>
            </Box>
          </>
        }
      </Box>
    </div>
  )
}
