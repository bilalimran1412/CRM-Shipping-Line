// @mui
import {Box, Typography, Stack} from '@mui/material';

import {useLocales} from "locales";
import {useState} from "react";
// @mui
import _ from 'lodash'
import DocumentItem from "./DocumentItem";

export default function DocumentView({data}) {
  const {translate} = useLocales()
  const emptyDocuments = (
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
        {translate('vehicle.view.empty_documents')}
      </Typography>

    </Stack>
  )
  return (
    <div>
      <Typography variant="h6" sx={{color: 'text.disabled'}}>
        {translate('vehicle.view.documents')}
      </Typography>

      <Box sx={{mt: 0}}>
        {data.length === 0 && emptyDocuments}
        {data.map(item => {
          return (
            <DocumentItem file={item} key={item.id}/>
          )
        })}
      </Box>
    </div>
  )
}
