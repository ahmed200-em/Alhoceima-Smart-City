import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ImagePlus, LoaderCircle, MapPin, Send, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import LoadingPlaceholder from '../../components/LoadingPlaceholder.jsx'
import { useReports } from '../../context/ReportsContext'
import { reportCategories } from '../../data/reports'
import { reportCategoryLabel } from '../../utils/reportFormat'
import { acceptedPhotoTypes, prepareReportPhoto } from '../../utils/reportPhoto'
import { LocalNotice } from './ReportUI'
import './ReportForm.css'

const steps = ['Details', 'Review', 'Complete']

function ReportSteps({ step }) {
  return (
    <nav aria-label="Report steps" className="report-steps">
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
    if (!fields.category) nextErrors.category = 'Select a category.'
    if (!fields.title.trim()) nextErrors.title = 'Enter a title.'
    if (!fields.description.trim()) nextErrors.description = 'Describe the issue.'
    if (!fields.neighborhood.trim()) nextErrors.neighborhood = 'Enter the neighbourhood where the issue occurred.'
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
        <h1 className="page-title">Report a problem</h1>
        <p className="muted">Report an issue in your neighbourhood and track its progress.</p>
      </header>

      <div className="report-form-layout grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section className="panel report-form-panel">
          <ReportSteps step={step} />

          {step === 0 && (
            <form onSubmit={reviewDetails} noValidate className="report-form-content grid gap-4">
              <h2 ref={stepHeading} tabIndex={-1}>Report details</h2>
              <p className="report-help">Fields marked with an asterisk are required.</p>

              <Field name="category" label="Category" error={errors.category} required>
                <select {...control('category')} required>
                  <option value="">Select a category</option>
                  {reportCategories.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>

              <Field name="title" label="Report title" error={errors.title} required>
                <input {...control('title')} required maxLength={100} placeholder="Example: Water leak on the road" />
              </Field>

              <Field name="description" label="Detailed description" error={errors.description} required>
                <textarea {...control('description')} required maxLength={1500} rows={4} placeholder="Describe the issue and when it started." />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="neighborhood" label="Neighbourhood" error={errors.neighborhood} required>
                  <input {...control('neighborhood')} required maxLength={80} placeholder="Example: Hay Al Matar" />
                </Field>
                <Field name="address" label="Street address (optional)">
                  <input {...control('address')} maxLength={160} placeholder="Street, junction or landmark…" />
                </Field>
              </div>

              <div className="report-field">
                <span className="report-field-label" id="report-photo-label">Photo (optional)</span>
                <div className="report-upload">
                  {photoState.loading ? <LoadingPlaceholder className="report-photo-preview" /> : (
                    photo && <img className="report-photo-preview" src={photo} alt="Preview of attached photo" />
                  )}
                  <div className="grid gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="button button-secondary report-photo-picker" htmlFor="report-photo">
                        <ImagePlus size={16} aria-hidden="true" />
                        {photo ? 'Change photo' : 'Choose a photo'}
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
                          <X size={16} aria-hidden="true" /> Remove photo
                        </button>
                      )}
                    </div>
                    <p className="report-help" id="report-photo-help">JPG, PNG or WebP · 10 MB maximum</p>
                    {photoState.loading && <p className="report-help" role="status">Preparing photo…</p>}
                    {photoState.error && <p className="report-field-error" role="alert">{photoState.error}</p>}
                  </div>
                </div>
              </div>

              <div className="report-form-actions">
                <Link className="button button-secondary" to="/">Cancel</Link>
                <button className="button button-primary" type="submit" disabled={photoState.loading}>Next step <ArrowRight size={16} aria-hidden="true" /></button>
              </div>
            </form>
          )}

          {step === 1 && (
            <form className="report-form-content grid gap-4" onSubmit={(event) => { event.preventDefault(); saveReport(true) }}>
              <h2 ref={stepHeading} tabIndex={-1}>Review your report</h2>
              <dl className="report-review-list">
                <div><dt>Category</dt><dd>{reportCategoryLabel(fields.category)}</dd></div>
                <div><dt>Title</dt><dd>{fields.title}</dd></div>
                <div><dt>Description</dt><dd>{fields.description}</dd></div>
                <div><dt>Neighbourhood</dt><dd>{fields.neighborhood}</dd></div>
                {fields.address.trim() && <div><dt>Address</dt><dd>{fields.address}</dd></div>}
                {photo && <div><dt>Photo</dt><dd><img className="report-photo-preview" src={photo} alt="Preview of attached photo" /></dd></div>}
              </dl>
              {submitError && <p className="report-banner-error" role="alert">{submitError.error}</p>}
              <div className="report-form-actions flex-wrap">
                <button className="button button-secondary" type="button" disabled={saving} onClick={() => { setSubmitError(null); setStep(0) }}><ArrowLeft size={16} aria-hidden="true" /> Back</button>
                {submitError?.photoTooLarge && <button className="button button-secondary" type="button" disabled={saving} onClick={() => saveReport(false)}>Save without a photo</button>}
                <button className="button button-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Submit report'}
                  {saving ? <LoaderCircle className="motion-safe:animate-spin" size={16} aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
                </button>
              </div>
              <p className="sr-only" role="status">{saving && 'Saving your report…'}</p>
            </form>
          )}

          {step === 2 && (
            <div className="report-complete grid justify-items-center gap-4 text-center">
              <CheckCircle2 className="report-complete-icon" size={64} strokeWidth={1.3} aria-hidden="true" />
              <h2 ref={stepHeading} tabIndex={-1}>Your report was saved.</h2>
              <p className="muted">You can find it in your dashboard any time you use this browser.</p>
              <div className="report-confirmation-ref">
                <span>Report reference</span>
                <strong>{submitted.id}</strong>
              </div>
              <Link className="button button-primary" to={`/signalements/${submitted.id}`}>Track my report <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link className="button button-secondary" to="/">Back to home</Link>
            </div>
          )}
        </section>

        <aside className="panel report-form-aside grid gap-4" data-reveal>
          <div className="report-help-icon"><MapPin size={21} aria-hidden="true" /></div>
          <h2>Tell us where it happened</h2>
          <p className="muted">A street name or nearby landmark helps pinpoint the issue.</p>
          <LocalNotice />
        </aside>
      </div>
    </div>
  )
}
