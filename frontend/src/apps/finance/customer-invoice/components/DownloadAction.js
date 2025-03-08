import {IconButton, Tooltip} from "@mui/material";
import Iconify from "../../../../components/iconify";
import {useState} from "react";
import {useLocales} from "../../../../locales";
import axios from "../../../../utils/axios";
import {useSnackbar} from "components/snackbar";

const DownloadAction = ({row}) => {
  const [loading, setLoading] = useState(false)
  const {translate} = useLocales()
  const {enqueueSnackbar} = useSnackbar()
  const onDownload = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`finance/customer-invoice/${row.id}/generate/`)
      window.open(response.data.file, '_blank')
    } catch (e) {
      enqueueSnackbar(translate('customer-invoice.error.download'), {
        variant: 'error',
        autoHideDuration: 5 * 1000
      })
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <Tooltip title={translate('download')}>
      {/*<Link component={RouterLink} to={`/${ROUTE_URL}/view/${row.id}`}>*/}
      <IconButton color="secondary" size={'small'} onClick={onDownload} disabled={loading}>
        <Iconify icon="material-symbols:download-sharp"/>
      </IconButton>
      {/*</Link>*/}
    </Tooltip>
  )
}

export default DownloadAction
