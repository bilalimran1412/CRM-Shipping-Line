// @mui
import {Typography, Fade, Tooltip} from '@mui/material';
import {
  Timeline as MUITimeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineOppositeContent,
} from '@mui/lab';


import {useLocales} from "locales";
import Image from "components/image";
import moment from "moment";
// @mui

export default function Timeline({detail}) {
  const {currentLang} = useLocales()

  return (
    <MUITimeline position="right">
      {detail.history.map((item) => (
        <TimelineItem key={item.id}>
          <TimelineOppositeContent
            // sx={item.status.icon && {mt: 2}}
          >
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{timeout: 600}}
              title={moment(new Date(item.datetime)).format('HH:mm:ss')}
              placement="bottom-end"
            >
              <Typography variant="subtitle2" sx={{color: 'warning.main', cursor: 'default'}}>
                {moment(new Date(item.datetime)).format('YYYY-MM-DD')}
              </Typography>
            </Tooltip>
          </TimelineOppositeContent>
          <TimelineSeparator>
            {!item.status.icon ?
              <TimelineDot color={'primary'}>
              </TimelineDot>
              :
              <Image
                disabledEffect
                alt={item.status.name[currentLang.value]}
                src={item.status.icon.file}
                sx={{height: 30, width: 30, mt: 0.3}}
                objectFit={'unset'}
                width={null}
              />
            }
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent
            // sx={item.status.icon && {mt: 2}}
          >
            <Typography
              variant="subtitle2"
              sx={{color: 'success.main', cursor: 'default'}}
            >
              {item.status.name[currentLang.value]}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </MUITimeline>
  )
}
