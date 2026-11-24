import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { PageLoadError } from './components/PageLoadState.jsx'
import AppLayout from './layouts/AppLayout.jsx'

function loadPage(importPage) {
  return lazy(() => importPage().catch(() => ({ default: PageLoadError })))
}

const Home = loadPage(() => import('./pages/Home.jsx'))
const NotFound = loadPage(() => import('./pages/NotFound.jsx'))
const Services = loadPage(() => import('./pages/services/Services.jsx'))
const ServiceDetails = loadPage(() => import('./pages/services/ServiceDetails.jsx'))
const ReportForm = loadPage(() => import('./pages/reports/ReportForm.jsx'))
const Dashboard = loadPage(() => import('./pages/reports/Dashboard.jsx'))
const ReportDetails = loadPage(() => import('./pages/reports/ReportDetails.jsx'))
const DemoAdmin = loadPage(() => import('./pages/reports/DemoAdmin.jsx'))
const News = loadPage(() => import('./pages/news/News.jsx'))
const NewsDetails = loadPage(() => import('./pages/news/NewsDetails.jsx'))

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetails />} />
        <Route path="signaler" element={<ReportForm />} />
        <Route path="tableau-de-bord" element={<Dashboard />} />
        <Route path="signalements/:id" element={<ReportDetails />} />
        <Route path="actualites" element={<News />} />
        <Route path="actualites/:slug" element={<NewsDetails />} />
        <Route path="administration-demo" element={<DemoAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
