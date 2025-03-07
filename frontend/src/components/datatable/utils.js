import {IconButton, Link, Tooltip} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import Iconify from "../iconify";
import {getCurrentUrlParamJSON} from "../../utils";

export const actionCellRenderer = ({ROUTE_URL, permissions, checkPermission, translate, onDelete, onDownload}) => row => {
  const params = getCurrentUrlParamJSON()
  return (
    <>
      {checkPermission(permissions.view) &&
        <Tooltip title={translate('view')}>
          <Link component={RouterLink} to={`/${ROUTE_URL}/view/${row.id}`}>
            <IconButton color="primary" size={'small'}>
              <Iconify icon="eva:eye-outline"/>
            </IconButton>
          </Link>
        </Tooltip>
      }
      {checkPermission(permissions.edit) &&
        <Tooltip title={translate('edit')}>
          <Link component={RouterLink} to={`/${ROUTE_URL}/edit/${row.id}${params}`}>
            <IconButton color="info" size={'small'}>
              <Iconify icon="eva:edit-outline"/>
            </IconButton>
          </Link>
        </Tooltip>
      }
      {checkPermission(permissions.delete) &&
        <Tooltip title={translate('delete')}>
          <IconButton color="error" size={'small'} onClick={() => onDelete(row.id)}>
            <Iconify icon="eva:trash-2-outline"/>
          </IconButton>
        </Tooltip>
      }
      
      {checkPermission(permissions.download) &&
        <Tooltip title={translate('download')}>
          <IconButton color="success" size={'small'} onClick={() => onDownload(row.id)}>
            <Iconify icon="eva:download-outline"/>
          </IconButton>
        </Tooltip>
      }
    </>
  )
}
