import "./App.css"

import { BrowserRouter } from "react-router-dom"

import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/sonner"
import PagesRouter from "@/routes/PagesRouter"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-muted/30 text-foreground">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-6 py-8">
          <PagesRouter />
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </BrowserRouter>
  )
}

export default App
