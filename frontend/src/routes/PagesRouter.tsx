import { Navigate, Outlet, Route, Routes } from "react-router-dom"

import { PrivateRoute } from "@/routes/PrivateRoute"
import { AuthProvider } from "@/contexts/AuthContext"

import EventsPage from "@/pages/EventsPage"
import SalesPage from "@/pages/SalesPage"
import LoginPage from "@/pages/LoginPage"

import Navbar from "@/components/Navbar"
import UsersPage from "@/pages/UsersPage"

const AdminLayout = () => (
  <>
    <Navbar />
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <Outlet />
    </main>
  </>
);

export default function PagesRouter() {
  return (
    <AuthProvider>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<PrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/events" />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
          </Route>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  )
}
