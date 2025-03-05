import {Box, Card, CircularProgress, Container, Grid, Tab, Tabs} from "@mui/material";
import {useEffect, useState} from "react";
import {useLocales} from "locales";
import {Helmet} from "react-helmet-async";
import {useSettingsContext} from "components/settings";
import ProfileForm from "../components/ProfileForm";
import useApi from "../../../../hooks/useApi";
import {store} from "../index";
import Error from "../../../../components/error";
import ChangePasswordForm from "../components/ChangePasswordForm";

const Profile = () => {
  const [tab, setTab] = useState('profile')
  const {translate} = useLocales()
  const {themeStretch} = useSettingsContext()

  return (
    <>
      <Helmet>
        <title>{translate('profile.title.profile')}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <Card sx={{pb: 1}}>
              <Tabs
                value={tab}
                onChange={(event, tabValue) => setTab(tabValue)}
                sx={{
                  // bgcolor: 'background.neutral',
                  px: 3
                }}
              >
                <Tab label={translate('profile.tab.profile')} value={'profile'}/>
                <Tab label={translate('profile.tab.password')} value={'password'}/>
              </Tabs>
            </Card>
            <Box sx={{mt: 2}} className={'relative-block'}>

              {(tab === 'profile') && <ProfileForm/>}
              {(tab === 'password') && <ChangePasswordForm/>}
            </Box>
          </Grid>
        </Grid>

      </Container>
    </>
  )
}

export default Profile