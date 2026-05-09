import { getNowMinutesInIST } from './timeZone.js'

const toCutoffMinutes = (cutoffTime) => {
  const [hours, minutes] = cutoffTime.split(':').map(Number)
  return hours * 60 + minutes
}

export const isCutoffPassed = (cutoffTime) => {
  return getNowMinutesInIST() >= toCutoffMinutes(cutoffTime)
}

export const isCutoffInPast = (cutoffTime) => {
  return getNowMinutesInIST() >= toCutoffMinutes(cutoffTime)
}
