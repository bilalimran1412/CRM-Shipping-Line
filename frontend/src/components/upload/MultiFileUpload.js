import {Upload} from "./index";
import {useCallback, useEffect, useState} from "react";
import {useLocales} from "../../locales";
import {uploadFile} from "../../utils/file";
import {useSnackbar} from "../snackbar";
import {v4 as uuidv4} from 'uuid'

const MultiFileUpload = ({type, onFileUpload, ...other}) => {
  const {translate} = useLocales()
  const [files, setFiles] = useState([])
  const [upload, setUpload] = useState({
    uploading: false,
    error: false,
    uploadState: {}
  })
  const {enqueueSnackbar} = useSnackbar()
  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            uuid: uuidv4(),
            preview: URL.createObjectURL(newFile),
          })
        ),
      ]);
    },
    [files]
  );


  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
  };

  const onUpload = () => {
    files.forEach(file => {
      if (upload.uploadState && upload.uploadState.hasOwnProperty(file.uuid) && upload.uploadState[file.uuid] !== 'error') {
        return null
      }
      uploadFile({
        file,
        type,
        setUploadState: progress => {
          setUpload(state => ({
            ...state,
            uploadState: {
              ...state.uploadState,
              [file.uuid]: progress,
            }
          }))
        },
        success: data => {
          setFiles(state => state.filter(item => item.uuid !== file.uuid))
          onFileUpload(data)
        },
        error: () => {
          setUpload(state => ({
            ...state,
            uploadState: {
              ...state.uploadState,
              [file.uuid]: 'error',
            }
          }))
          enqueueSnackbar(translate('upload_error'), {
            variant: 'error',
            autoHideDuration: 5 * 1000
          })
        }
      })
    })
  }
  const handleRemoveAllFiles = () => {
    setFiles(state => {
      return state.filter(item => {
        return upload.uploadState.hasOwnProperty(item.uuid);
      })
    });
  };

  return (
    <Upload
      uploadState={upload}
      multiple
      thumbnail={true}
      files={files}
      onDrop={handleDropMultiFile}
      onRemove={handleRemoveFile}
      onRemoveAll={handleRemoveAllFiles}
      onUpload={onUpload}
      {...other}
    />
  )
}

export default MultiFileUpload