import {Tab, Tabs} from "@mui/material"
import {useSearchParams} from "react-router-dom"
import {getCurrentUrlParam} from "../../utils"

const TabFilter = ({name, defaultValue, options}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = searchParams.get(name)
  const setFilter = (event, tabValue) => {
    const params = getCurrentUrlParam()
    params.delete('page')
    if(tabValue === defaultValue){
      params.delete(name)
    } else {
      params.set(name, tabValue)
    }
    setSearchParams(params)
  }
  return (
    <Tabs
      value={value || defaultValue}
      onChange={setFilter}
      sx={{
        px: 2,
        bgcolor: 'background.neutral',
      }}
    >

      {options.map((tab, index) => (
        <Tab key={index} label={tab.label} value={tab.value}/>
      ))}
    </Tabs>
  )
}

export default TabFilter