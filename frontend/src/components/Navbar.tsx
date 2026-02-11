import { NavLink } from "react-router-dom"
import { Button } from "./ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Ticket } from "lucide-react"

const links = [
  { label: "Eventos", to: "/admin/events" },
  { label: "Vendas", to: "/admin/sales" },
  { label: "Usuários", to: "/admin/users" },
]

export default function Navbar() {
  const { logout } = useAuth()

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex flex-col">
          <span className="text-sm uppercase tracking-widest text-muted-foreground">
            Sistema de Vendas
          </span>
          <span className="text-lg font-semibold flex items-center gap-2">
            <Ticket className="size-4 text-muted-foreground" />
            Administração de Ingressos
          </span>
        </div>
        <nav className="flex items-center gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}

          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </nav>
      </div>
    </header>
  )
}
