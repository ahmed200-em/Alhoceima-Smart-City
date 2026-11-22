import { Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Services from "./pages/services/Services.jsx";
import ServiceDetails from "./pages/services/ServiceDetails.jsx";
import ReportForm from "./pages/reports/ReportForm.jsx";
import Dashboard from "./pages/reports/Dashboard.jsx";
import ReportDetails from "./pages/reports/ReportDetails.jsx";
import DemoAdmin from "./pages/reports/DemoAdmin.jsx";
import News from "./pages/news/News.jsx";
import NewsDetails from "./pages/news/NewsDetails.jsx";

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
        <Route path="administration" element={<DemoAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
