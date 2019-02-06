const countObjectProperties = obj => {
  if (typeof obj === 'object') {
    return Object.keys(obj).length
  }
  return 0
}

// eslint-disable-next-line
const weekDaysToIso = {
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
  'Sunday': 7
}

// eslint-disable-next-line
const isoToWeekDays = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday'
}

const getIsoDayFromString = dayStr => {
  return weekDaysToIso[dayStr]
}

const getStringFromIsoDay = isoDay => {
  return isoToWeekDays[isoDay]
}

export {
  countObjectProperties,
  getIsoDayFromString,
  getStringFromIsoDay
}
