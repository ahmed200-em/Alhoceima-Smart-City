import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import NotFound from './pages/NotFound.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/services/Services.jsx'
import ServiceDetails from './pages/services/ServiceDetails.jsx'
import News from './pages/news/News.jsx'
import NewsDetails from './pages/news/NewsDetails.jsx'

function PreviewPage({ title }) {
  return (
    <section className="page-shell py-8">
      <h1 className="page-title">{title}</h1>
      <p className="muted mt-2">Cette rubrique est en cours de préparation.</p>
    </section>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetails />} />
        <Route path="signaler" element={<PreviewPage title="Signaler un problème" />} />
        <Route path="tableau-de-bord" element={<PreviewPage title="Mon tableau de bord" />} />
        <Route path="signalements/:id" element={<PreviewPage title="Suivi du signalement" />} />
        <Route path="actualites" element={<News />} />
        <Route path="actualites/:slug" element={<NewsDetails />} />
        <Route path="administration" element={<PreviewPage title="Administration démo" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
