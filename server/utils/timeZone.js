const BUSINESS_TIME_ZONE = 'Asia/Kolkata'
const IST_OFFSET_MINUTES = 330

const formatPartsInIST = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'short'
  }).formatToParts(date)

  const getPart = (type) => parts.find(part => part.type === type)?.value

  return {
    year: Number(getPart('year')),
    month: Number(getPart('month')),
    day: Number(getPart('day')),
    hour: Number(getPart('hour')),
    minute: Number(getPart('minute')),
    second: Number(getPart('second')),
    weekday: getPart('weekday')
  }
}

const toISTMidnightAsUTCDate = (year, month, day) => {
  const utcMillis = Date.UTC(year, month - 1, day, 0, 0, 0, 0) - (IST_OFFSET_MINUTES * 60 * 1000)
  return new Date(utcMillis)
}

const WEEKDAY_MAP = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
}

export const getTodayDateInIST = () => {
  const { year, month, day } = formatPartsInIST()
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export const getCurrentTimeInIST = () => {
  const { hour, minute } = formatPartsInIST()
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export const getNowMinutesInIST = () => {
  const { hour, minute } = formatPartsInIST()
  return (hour * 60) + minute
}

export const getStartOfCurrentWeekInISTAsUTCDate = () => {
  const { year, month, day, weekday } = formatPartsInIST()
  const weekdayIndex = WEEKDAY_MAP[weekday] ?? 0

  const dateOnlyUTC = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
  dateOnlyUTC.setUTCDate(dateOnlyUTC.getUTCDate() - weekdayIndex)

  return toISTMidnightAsUTCDate(
    dateOnlyUTC.getUTCFullYear(),
    dateOnlyUTC.getUTCMonth() + 1,
    dateOnlyUTC.getUTCDate()
  )
}

export const getStartOfCurrentMonthInISTAsUTCDate = () => {
  const { year, month } = formatPartsInIST()
  return toISTMidnightAsUTCDate(year, month, 1)
}
