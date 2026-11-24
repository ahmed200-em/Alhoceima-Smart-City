import { reportStatuses, sampleReports } from '../data/reports.js'

export const reportsStorageKey = 'smartcity-al-hoceima-reports-v1'
const knownStatus = (status) => reportStatuses.some((entry) => entry.value === status)
const validDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value))

function validReport(report) {
  if (!report || typeof report !== 'object') return false
  const textFields = ['id', 'category', 'title', 'description', 'neighborhood', 'address']
  return textFields.every((field) => typeof report[field] === 'string')
    && knownStatus(report.status)
    && validDate(report.createdAt)
    && Array.isArray(report.history)
    && report.history.every((update) => update && knownStatus(update.status) && validDate(update.date))
}

export function readReports() {
  const stored = window.localStorage.getItem(reportsStorageKey)
  if (stored === null) return sampleReports

  const parsed = JSON.parse(stored)
  if (!Array.isArray(parsed) || !parsed.every(validReport)) throw new Error('Invalid report storage format')

  return parsed.map((report) => {
    const sample = report.sample && sampleReports.find((entry) => entry.id === report.id)
    if (!sample) return report

    // Use current demo text while keeping locally saved status and history.
    const { title, description, address } = sample
    return { ...report, title, description, address }
  })
}

export function writeReports(reports) {
  window.localStorage.setItem(reportsStorageKey, JSON.stringify(reports))
}

export function isStorageFull(error) {
  return error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
}

export function withReportsLock(update) {
  const locks = window.navigator.locks
  return locks ? locks.request(reportsStorageKey, update) : update()
}
