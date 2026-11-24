import { reportCategories } from '../data/reports.js'

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Africa/Casablanca' })
const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Casablanca',
})

export function formatReportDate(date, withTime = false) {
  return (withTime ? dateTimeFormat : dateFormat).format(new Date(date))
}

export function reportCategoryLabel(value) {
  return reportCategories.find((category) => category.value === value)?.label ?? 'Other'
}

function normalize(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

export function filterReports(reports, search, status) {
  const query = normalize(search.trim())

  return reports.filter((report) => {
    const searchable = [report.id, report.title, report.neighborhood, report.address, reportCategoryLabel(report.category)]
    return (status === 'all' || report.status === status) && normalize(searchable.join(' ')).includes(query)
  })
}
