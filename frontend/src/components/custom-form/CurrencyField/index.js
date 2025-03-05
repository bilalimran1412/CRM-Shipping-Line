// form
import {Controller, useFormContext} from 'react-hook-form'
// @mui
import {Button, IconButton, InputAdornment, Stack, TextField, Tooltip, Zoom} from '@mui/material'
import Iconify from "../../iconify";
import {useLocales} from "../../../locales";
import {useEffect, useRef, useState} from "react";
import {useSnackbar} from "../../snackbar";
import './style.scss'
import {fNumber, numberSeparatorValue, transformNumberFormat} from "../../../utils/formatNumber";

import _ from 'lodash'
import {fi} from "date-fns/locale";
// ----------------------------------------------------------------------

export const getCurrencyRate = (base, target, rates) => {
  try {
    return rates.find(rate => rate.base === base && rate.target === target)
  } catch (e) {
    // console.log(e)
    return null
  }
}
export const convertCurrencyAmount = (amount, base, target, rates, rate = null) => {
  amount = Number(amount)
  rate = Number(rate)
  const currencyRate = getCurrencyRate(base, target, rates)
  if (!currencyRate) {
    return currencyRate
  }
  let finalAmount
  if (base === target) {
    return amount
  }
  let rateAmount
  if (rate) {
    rateAmount = Number(rate)
  } else {
    rateAmount = Number(currencyRate.rate)
  }
  if (currencyRate.math_type === 'multiplication') {
    finalAmount = Number(amount) * rateAmount
  }
  if (currencyRate.math_type === 'division') {
    finalAmount = Number(amount) / rateAmount
  }
  return finalAmount
}

function getNextElementById(currentId, array) {
  if (!Array.isArray(array)) return null
  const currentIndex = _.findIndex(array, {id: currentId});
  const nextIndex = (currentIndex + 1) % array.length; // Wrap around if last element
  return array[nextIndex];
}

export default function CurrencyField({name, currencies = [], rates, primaryCurrency, helperText, onChange, ...other}) {
  const {control, setValue, getValues, watch} = useFormContext()
  const [isOpen, setIsOpen] = useState(false)
  const [currency, setCurrency] = useState({})
  const [mode, setMode] = useState('amount')
  const {translate} = useLocales()
  const {enqueueSnackbar} = useSnackbar()
  const fileInputRef = useRef(null);
  const onChangeCurrency = () => {
    const nextCurrency = getNextElementById(currency?.id, currencies)
    const currencyRate = rates.find(item => item.base === nextCurrency.id && item.target === primaryCurrency.id)
    setCurrency(nextCurrency)
    setValue(`${name}.currency`, nextCurrency.id)
    if (currencyRate) {
      setValue(`${name}.exchange_rate`, currencyRate.rate)
    } else {
      setValue(`${name}.exchange_rate`, `1`)
    }
  };
  const onChangeMode = () => {
    setMode(state => {
      if (state === 'amount') {
        return 'rate'
      }
      if (state === 'rate') {
        return 'amount'
      }
    })
  };
  const onClear = () => {
    setValue(name, null)
  }
  useEffect(() => {
    const subscription = watch((value, {name: fieldName, type, ...props}) => {
      const currency = `${name}.currency`
      const amount = `${name}.amount_in_currency`
      const rate = `${name}.exchange_rate`
      if (fieldName === currency || fieldName === amount || fieldName === rate) {
        let currency = getValues(`${name}.currency`)
        const amount = getValues(`${name}.amount_in_currency`)
        const rate = getValues(`${name}.exchange_rate`)
        if(typeof currency === 'object'){
          currency = currency.id
        }
        if (currency === primaryCurrency?.id) {
          setValue(`${name}.amount_in_default`, amount)
        } else {
          setValue(`${name}.amount_in_default`, convertCurrencyAmount(amount, currency, primaryCurrency?.id, rates, rate))
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  useEffect(() => {
    const primary = currencies.find(item => item.id === primaryCurrency.id)
    const current = currencies.find(item => item.id === getValues(`${name}.currency`))
    if (!current) {
      setCurrency(primary)
    } else {
      setCurrency(current)
    }
  }, []);
  const getAmountTooltipValue = (base) => {
    const amount = getValues(`${name}.amount_in_currency`)
    const rate = getValues(`${name}.exchange_rate`)
    const value = fNumber(convertCurrencyAmount(amount, base, primaryCurrency?.id, rates, rate))
    return `${value} ${primaryCurrency?.code}`
  }
  const separatorValue = numberSeparatorValue
  const handleChange = (event, field) => {
    const value = event.target.value;
    const regex = /^[0-9., ]*$/;
    if (regex.test(value)) {
      field.onChange(transformNumberFormat(event.target.value))
    }
  };
  const amountField = (
    <Controller
      name={`${name}.amount_in_currency`}
      key={`${name}.amount_in_currency`}
      control={control}
      render={({field, fieldState: {error}}) => {
        return (
          <div className={'currency-field'}>
            <Tooltip title={`${getAmountTooltipValue(1)}`} placement="bottom" arrow
                     TransitionComponent={Zoom} open={(isOpen && currency?.id !== primaryCurrency?.id)}>
              <TextField
                {...field}
                onFocus={() => {
                  setIsOpen(true)
                }}
                onBlur={(...props) => {
                  field.onBlur(...props)
                  setIsOpen(false)
                }}
                onChange={event => handleChange(event, field)}
                fullWidth
                // value={(typeof field.value === 'number' && field.value === 0 ? '' : field.value) || ''}
                error={!!error}
                helperText={error ? error?.message : helperText}
                {...other}
                value={separatorValue(field.value)}
                // type={'number'}
                InputProps={{
                  spellCheck: false,
                  autoComplete: 'off',
                  startAdornment: (
                    <InputAdornment position="start" className={'currency'} onClick={onChangeCurrency}>
                      {currency?.code}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {(currency?.id !== primaryCurrency?.id) &&
                        <InputAdornment position="end">
                          <Stack spacing={1} direction={'row'}>
                            <>
                              <IconButton edge="end" onClick={onChangeMode} size={'small'}>
                                <Iconify icon={'ic:baseline-currency-exchange'}/>
                              </IconButton>
                            </>
                          </Stack>
                        </InputAdornment>
                      }
                    </>
                  ),
                }}
              />
            </Tooltip>
          </div>
        )
      }}
    />
  )
  const rateField = (
    <Controller
      name={`${name}.exchange_rate`}
      control={control}
      key={`${name}.exchange_rate`}
      render={({field, fieldState: {error}}) => {
        return (
          <div className={'currency-field'}>
            <Tooltip title={`${getAmountTooltipValue(1)}`} placement="bottom" arrow
                     TransitionComponent={Zoom} open={(isOpen && currency?.id !== primaryCurrency?.id)}>
              <TextField
                {...field}
                onFocus={() => {
                  setIsOpen(true)
                }}
                onBlur={(...props) => {
                  field.onBlur(...props)
                  setIsOpen(false)
                }}
                // onChange={event => handleChange(event, field)}
                fullWidth
                // value={(typeof field.value === 'number' && field.value === 0 ? '' : field.value) || ''}
                onChange={event => handleChange(event, field)}
                value={separatorValue(field.value)}
                error={!!error}
                helperText={error ? error?.message : helperText}
                {...other}
                // type={'number'}
                label={translate('currency_rate')}
                InputProps={{
                  spellCheck: false,
                  autoComplete: 'off',
                  startAdornment: (
                    <InputAdornment position="start" className={'currency'}>
                      {currency?.code} > {primaryCurrency?.code}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Stack spacing={1} direction={'row'}>
                        <Button
                          size={other?.size}
                          color="success"
                          variant="contained"
                          onClick={onChangeMode}
                        >
                          {translate('save')}
                        </Button>
                      </Stack>
                    </InputAdornment>
                  ),
                }}
              />
            </Tooltip>
          </div>
        )
      }}
    />
  )
  if (mode === 'amount') {
    return amountField
  }
  if (mode === 'rate') {
    return rateField
  }

}
