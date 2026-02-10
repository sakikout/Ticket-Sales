import { Navigate, Route, Routes } from "react-router-dom"

import EventsPage from "@/pages/EventsPage"
import SalesPage from "@/pages/SalesPage"

export default function PagesRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/sales" element={<SalesPage />} />
    </Routes>
  )
}
