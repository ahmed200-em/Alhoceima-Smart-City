import { createContext, useContext, useEffect, useState } from 'react'
import { reportStatuses, sampleReports } from '../data/reports.js'
import { isStorageFull, readReports, reportsStorageKey, withReportsLock, writeReports } from '../services/reportStorage.js'

const ReportsContext = createContext(null)
const unavailableMessage = 'L’enregistrement local a échoué. Vérifiez que votre navigateur autorise le stockage et dispose d’assez d’espace.'

function loadReports() {
  try {
    return { reports: readReports(), storageError: '' }
  } catch {
    return { reports: sampleReports, storageError: 'Le stockage local est indisponible. Les signalements d’exemple restent consultables.' }
  }
}

export function ReportsProvider({ children }) {
  const [data, setData] = useState(loadReports)

  useEffect(() => {
    function synchronize(event) {
      if (event.key === reportsStorageKey || event.key === null) setData(loadReports())
    }

    window.addEventListener('storage', synchronize)
    return () => window.removeEventListener('storage', synchronize)
  }, [])

  async function addReport(fields) {
    try {
      return await withReportsLock(() => {
        const currentReports = readReports()
        const createdAt = new Date().toISOString()
        const year = new Intl.DateTimeFormat('fr-FR', { year: 'numeric', timeZone: 'Africa/Casablanca' }).format(new Date(createdAt))
        let id

        do {
          const bytes = crypto.getRandomValues(new Uint32Array(1))
          id = `SC-${year}-${bytes[0].toString(16).toUpperCase().padStart(8, '0')}`
        } while (currentReports.some((report) => report.id === id))

        const report = {
          ...fields,
          id,
          createdAt,
          status: 'pending',
          history: [{ status: 'pending', date: createdAt }],
        }
        const reports = [report, ...currentReports]
        writeReports(reports)
        setData({ reports, storageError: '' })
        return { report }
      })
    } catch (error) {
      if (fields.photo && isStorageFull(error)) {
        return { error: 'L’espace disponible est insuffisant pour enregistrer la photo. Vous pouvez enregistrer le signalement sans photo.', photoTooLarge: true }
      }

      return { error: unavailableMessage }
    }
  }

  async function changeReportStatus(id, status) {
    if (!reportStatuses.some((entry) => entry.value === status)) return { error: 'Statut inconnu.' }

    try {
      return await withReportsLock(() => {
        const currentReports = readReports()
        const report = currentReports.find((entry) => entry.id === id)
        if (!report) return { error: 'Ce signalement n’est plus disponible dans ce navigateur.' }
        if (report.status === status) {
          setData({ reports: currentReports, storageError: '' })
          return {}
        }

        const update = { status, date: new Date().toISOString() }
        const reports = currentReports.map((entry) => (
          entry.id === id ? { ...entry, status, history: [...entry.history, update] } : entry
        ))
        writeReports(reports)
        setData({ reports, storageError: '' })
        return {}
      })
    } catch {
      return { error: unavailableMessage }
    }
  }

  return <ReportsContext.Provider value={{ ...data, addReport, changeReportStatus }}>{children}</ReportsContext.Provider>
}

export function useReports() {
  return useContext(ReportsContext)
}
