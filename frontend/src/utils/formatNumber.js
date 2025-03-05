import numeral from 'numeral'
import {da} from "date-fns/locale";

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format()
}

export function roundNumber(value) {
  if (value >= 100000) {
    // Округление по 5000 вверх или вниз
    return Math.ceil(value / 5000) * 5000;
  } else if (value >= 10) {
    return value;
  } else {
    return value.toFixed(2);
  }
}

export const transformNumberFormat = (value) => {
  // Удаляем пробелы и заменяем запятую на точку
  return `${value || ''}`.replace(/\s+/g, '').replace(',', '.');
};
export const numberSeparatorValue = (value) => {
  try {
    value = transformNumberFormat(value);

    const formatNumber = (num) => {
      const isNegative = num < 0;
      num = Math.abs(num); // Make the number positive for formatting
      const parts = num.toString().split(".");
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      const decimalPart = parts[1] ? "." + parts[1].replace(/(\d{3})/g, '$1,') : "";
      const formattedNumber = integerPart + decimalPart;
      return isNegative ? `-${formattedNumber}` : formattedNumber;
    };

    const removeNonNumeric = (num) => num.toString().replace(/[^0-9.,-]/g, "");
    const numericValue = removeNonNumeric(`${value}`.replace('.', ','));
    const data = formatNumber(parseFloat(numericValue.replace(',', '.')))
    if (isNaN(Number(transformNumberFormat(data)))) return ''
    return data
  } catch (e) {
    console.log(e);
    return '0';
  }
};


export function fCurrency(number) {
  const format = number ? numeral(number).format('$0,0.00') : ''

  return result(format, '.00')
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : ''

  return result(format, '.0')
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : ''

  return result(format, '.00')
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : ''

  return result(format, '.0')
}

function result(format, key = '.00') {
  const isInteger = format.includes(key)

  return isInteger ? format.replace(key, '') : format
}

export function extractIntegers(str) {
  // Use a regular expression to find the first sequence of digits in the string
  const regex = /\d+/;
  // Match the regular expression against the string
  const match = str.match(regex);
  // If there is no match, return null
  if (!match) {
    return null;
  }
  // Convert the matched string to an integer and return it
  return Number(match[0]);
}