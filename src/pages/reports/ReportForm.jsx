import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ImagePlus, MapPin, Send, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useReports } from '../../context/ReportsContext'
import { reportCategories } from '../../data/reports'
import { reportCategoryLabel } from '../../utils/reportFormat'
import { acceptedPhotoTypes, prepareReportPhoto } from '../../utils/reportPhoto'
import { LocalNotice } from './ReportUI'
import './ReportForm.css'

const steps = ['Détails', 'Confirmation', 'Terminé']

function ReportSteps({ step }) {
  return (
    <nav aria-label="Étapes du signalement" className="report-steps">
      <ol>
        {steps.map((label, index) => (
          <li key={label} className={index <= step ? 'is-reached' : ''} aria-current={index === step ? 'step' : undefined}>
            <span className="report-step-index" aria-hidden="true">{index < step ? <Check size={14} strokeWidth={3} /> : index + 1}</span>
            {label}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function Field({ name, label, error, required = false, children }) {
  return (
    <div className="report-field">
      <label htmlFor={`report-${name}`}>
        {label}{required && <span className="report-required" aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && <p id={`report-${name}-error`} className="report-field-error">{error}</p>}
    </div>
  )
}

export default function ReportForm() {
  const { addReport } = useReports()
  const [searchParams] = useSearchParams()
  const requestedCategory = searchParams.get('categorie')
  const [fields, setFields] = useState(() => ({
    category: reportCategories.some((item) => item.value === requestedCategory) ? requestedCategory : '',
    title: '',
    description: '',
    neighborhood: '',
    address: '',
  }))
  const [photo, setPhoto] = useState('')
  const [photoState, setPhotoState] = useState({ loading: false, error: '' })
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitted, setSubmitted] = useState(null)
  const stepHeading = useRef(null)
  const previousStep = useRef(0)

  useEffect(() => {
    if (step !== previousStep.current) {
      stepHeading.current?.focus()
      previousStep.current = step
    }
  }, [step])

  function control(name) {
    return {
      id: `report-${name}`,
      name,
      className: 'field-control',
      value: fields[name],
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': errors[name] ? `report-${name}-error` : undefined,
      onChange(event) {
        const { value } = event.target
        setFields((current) => ({ ...current, [name]: value }))
        if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
      },
    }
  }

  async function onPhotoChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setPhotoState({ loading: true, error: '' })
    try {
      setPhoto(await prepareReportPhoto(file))
      setPhotoState({ loading: false, error: '' })
    } catch (error) {
      setPhotoState({ loading: false, error: error.message })
    }
  }

  function reviewDetails(event) {
    event.preventDefault()
    if (photoState.loading) return

    const nextErrors = {}
    if (!fields.category) nextErrors.category = 'Sélectionnez une catégorie.'
    if (!fields.title.trim()) nextErrors.title = 'Saisissez un titre.'
    if (!fields.description.trim()) nextErrors.description = 'Décrivez le problème rencontré.'
    if (!fields.neighborhood.trim()) nextErrors.neighborhood = 'Indiquez le quartier du problème.'
    setErrors(nextErrors)

    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      window.requestAnimationFrame(() => document.getElementById(`report-${firstInvalid}`)?.focus())
      return
    }

    setStep(1)
  }

  async function saveReport(includePhoto) {
    if (saving) return

    setSaving(true)
    setSubmitError(null)
    const values = Object.fromEntries(Object.entries(fields).map(([name, value]) => [name, value.trim()]))
    const result = await addReport({ ...values, photo: includePhoto ? photo : '' })
    setSaving(false)

    if (result.error) {
      setSubmitError(result)
      return
    }

    setSubmitted(result.report)
    setSubmitError(null)
    setStep(2)
  }

  return (
    <div className="page-shell reports-page report-form-page">
      <header className="report-page-heading" data-enter>
        <h1 className="page-title">Signaler un problème</h1>
        <p className="muted">Décrivez le problème rencontré dans votre quartier et suivez son traitement.</p>
      </header>

      <div className="report-form-layout grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section className="panel report-form-panel">
          <ReportSteps step={step} />

          {step === 0 && (
            <form onSubmit={reviewDetails} noValidate className="report-form-content grid gap-4">
              <h2 ref={stepHeading} tabIndex={-1}>Détails du signalement</h2>
              <p className="report-help">Les champs marqués d’un astérisque sont obligatoires.</p>

              <Field name="category" label="Catégorie" error={errors.category} required>
                <select {...control('category')} required>
                  <option value="">Sélectionner une catégorie</option>
                  {reportCategories.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>

              <Field name="title" label="Titre du signalement" error={errors.title} required>
                <input {...control('title')} required maxLength={100} placeholder="Ex. Fuite d’eau sur la chaussée" />
              </Field>

              <Field name="description" label="Description détaillée" error={errors.description} required>
                <textarea {...control('description')} required maxLength={1500} rows={4} placeholder="Décrivez le problème et indiquez depuis quand il se produit." />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="neighborhood" label="Quartier" error={errors.neighborhood} required>
                  <input {...control('neighborhood')} required maxLength={80} placeholder="Ex. Hay Al Matar" />
                </Field>
                <Field name="address" label="Adresse précise (facultatif)">
                  <input {...control('address')} maxLength={160} placeholder="Rue, intersection, point de repère…" />
                </Field>
              </div>

              <div className="report-field">
                <span className="report-field-label" id="report-photo-label">Photo (facultatif)</span>
                <div className="report-upload">
                  {photo && <img className="report-photo-preview" src={photo} alt="Aperçu de la photo jointe" />}
                  <div className="grid gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="button button-secondary report-photo-picker" htmlFor="report-photo">
                        <ImagePlus size={16} aria-hidden="true" />
                        {photo ? 'Changer la photo' : 'Choisir une photo'}
                        <input
                          className="sr-only"
                          id="report-photo"
                          type="file"
                          accept={acceptedPhotoTypes}
                          aria-describedby="report-photo-help"
                          disabled={photoState.loading}
                          onChange={onPhotoChange}
                        />
                      </label>
                      {photo && (
                        <button type="button" className="button report-remove-photo" disabled={photoState.loading} onClick={() => { setPhoto(''); setPhotoState({ loading: false, error: '' }) }}>
                          <X size={16} aria-hidden="true" /> Supprimer la photo
                        </button>
                      )}
                    </div>
                    <p className="report-help" id="report-photo-help">JPG, PNG ou WebP · 10 Mo maximum</p>
                    {photoState.loading && <p className="report-help" role="status">Préparation de la photo…</p>}
                    {photoState.error && <p className="report-field-error" role="alert">{photoState.error}</p>}
                  </div>
                </div>
              </div>

              <div className="report-form-actions">
                <Link className="button button-secondary" to="/">Annuler</Link>
                <button className="button button-primary" type="submit" disabled={photoState.loading}>Étape suivante <ArrowRight size={16} aria-hidden="true" /></button>
              </div>
            </form>
          )}

          {step === 1 && (
            <form className="report-form-content grid gap-4" onSubmit={(event) => { event.preventDefault(); saveReport(true) }}>
              <h2 ref={stepHeading} tabIndex={-1}>Vérifiez les informations</h2>
              <dl className="report-review-list">
                <div><dt>Catégorie</dt><dd>{reportCategoryLabel(fields.category)}</dd></div>
                <div><dt>Titre</dt><dd>{fields.title}</dd></div>
                <div><dt>Description</dt><dd>{fields.description}</dd></div>
                <div><dt>Quartier</dt><dd>{fields.neighborhood}</dd></div>
                {fields.address.trim() && <div><dt>Adresse</dt><dd>{fields.address}</dd></div>}
                {photo && <div><dt>Photo</dt><dd><img className="report-photo-preview" src={photo} alt="Aperçu de la photo jointe" /></dd></div>}
              </dl>
              {submitError && <p className="report-banner-error" role="alert">{submitError.error}</p>}
              <div className="report-form-actions flex-wrap">
                <button className="button button-secondary" type="button" disabled={saving} onClick={() => { setSubmitError(null); setStep(0) }}><ArrowLeft size={16} aria-hidden="true" /> Retour</button>
                {submitError?.photoTooLarge && <button className="button button-secondary" type="button" disabled={saving} onClick={() => saveReport(false)}>Enregistrer sans photo</button>}
                <button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Soumettre le signalement'} <Send size={16} aria-hidden="true" /></button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="report-complete grid justify-items-center gap-4 text-center">
              <CheckCircle2 className="report-complete-icon" size={64} strokeWidth={1.3} aria-hidden="true" />
              <h2 ref={stepHeading} tabIndex={-1}>Votre signalement a été enregistré.</h2>
              <p className="muted">Retrouvez-le à tout moment dans votre tableau de bord sur ce navigateur.</p>
              <div className="report-confirmation-ref">
                <span>Référence du signalement</span>
                <strong>{submitted.id}</strong>
              </div>
              <Link className="button button-primary" to={`/signalements/${submitted.id}`}>Suivre mon signalement <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link className="button button-secondary" to="/">Retour à l’accueil</Link>
            </div>
          )}
        </section>

        <aside className="panel report-form-aside grid gap-4">
          <div className="report-help-icon"><MapPin size={21} aria-hidden="true" /></div>
          <h2>Précisez le lieu du problème</h2>
          <p className="muted">Le nom de la rue ou un point de repère aide à comprendre où se situe le problème.</p>
          <LocalNotice />
        </aside>
      </div>
    </div>
  )
}
