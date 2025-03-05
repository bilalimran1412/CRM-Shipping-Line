import {forwardRef, useCallback, useImperativeHandle, useState} from "react";
import Lightbox from "components/lightbox";

export const PhotoModal = forwardRef(({photos}, ref) => {
  const [props, setProps] = useState({open: false})
  const onClose = useCallback(() => {
    setProps(state => ({
      open: false
    }))
  }, [])
  useImperativeHandle(ref, () => {
    return {
      open(index) {
        setProps(state => ({
          ...state,
          index,
          open: true
        }))
      },
      close() {
        onClose()
      },
    };
  }, []);
  return (
    <Lightbox
      // disabledZoom={true}
      // disabledTotal={true}
      // disabledVideo={true}
      // disabledCaptions={true}
      // disabledSlideshow={true}
      // disabledThumbnails={true}
      // disabledFullscreen={true}
      index={props.index}
      open={props.open}
      close={onClose}
      slides={photos.map(item => ({
        src: item.file.file
      }))}
    />
  )
})