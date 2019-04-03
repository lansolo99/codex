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

const getIsoDayFromString = dayStr => {
  return weekDaysToIso[dayStr]
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

const getStringFromIsoDay = isoDay => {
  return isoToWeekDays[isoDay]
}

// eslint-disable-next-line
const humanReadableHoursToNumbers = {
  '00:00': 0,
  '00:01': 1,
  '00:02': 2,
  '00:03': 3,
  '00:04': 4,
  '00:05': 5,
  '00:06': 6,
  '00:07': 7,
  '00:08': 8,
  '00:09': 9,
  '00:10': 10,
  '00:11': 11,
  '00:12': 12,
  '00:13': 13,
  '00:14': 14,
  '00:15': 15,
  '00:16': 16,
  '00:17': 17,
  '00:18': 18,
  '00:19': 19,
  '00:20': 20,
  '00:21': 21,
  '00:22': 22,
  '00:23': 23
}

const getNumberFromFormattedHour = formattedHour => {
  return humanReadableHoursToNumbers[formattedHour]
}

export {
  countObjectProperties,
  getIsoDayFromString,
  getStringFromIsoDay,
  getNumberFromFormattedHour
}
