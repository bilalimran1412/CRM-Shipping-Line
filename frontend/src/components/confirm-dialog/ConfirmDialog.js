import PropTypes from 'prop-types'
// @mui
import {Dialog, Button, DialogTitle, DialogActions, DialogContent} from '@mui/material'
import {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from "react";

// ----------------------------------------------------------------------


const ConfirmDialog = forwardRef(({title, ...other}, ref) => {
  const [dialog, setDialog] = useState({open: false})
  const onClose = useCallback(() => setDialog(state => ({...state, open: false})), [])
  useImperativeHandle(ref, () => {
    return {
      open({title, content, confirmText, confirmColor = 'primary', cancelText, cancelColor = 'error', callback}) {
        setDialog({
          title,
          content,
          confirmText,
          confirmColor,
          cancelText,
          cancelColor,
          callback,
          open: true
        })
      },
      close() {
        onClose()
      },
    };
  }, []);
  useEffect(() => {
    if (Object.keys(dialog).length > 1 && dialog?.open === false) {
      const timeout = setTimeout(() => {
        setDialog({open: false})
        clearTimeout(timeout)
      }, 600)
    }
  }, [dialog]);
  return (
    <Dialog fullWidth maxWidth="xs" open={dialog?.open || false} onClose={onClose} {...other}>
      <DialogTitle sx={{pb: 2}}>{dialog?.title}</DialogTitle>

      {dialog?.content && <DialogContent sx={{typography: 'body2'}}> {dialog.content} </DialogContent>}

      <DialogActions>

        <Button variant="outlined" color={dialog?.confirmColor} onClick={() => dialog?.callback?.(onClose)}>
          {dialog?.confirmText}
        </Button>
        <Button variant="outlined" color={dialog?.cancelColor} onClick={onClose}>
          {dialog?.cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default ConfirmDialog