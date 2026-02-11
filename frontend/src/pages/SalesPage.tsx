import { type FormEvent, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Trash2, Pencil, CircleDollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createSale, deleteSale, getSales, updateSaleStatus } from "@/services/sales"
import { getEvents } from "@/services/events"
import { getUsers } from "@/services/users"
import type { Event, Sale, SaleDTO, SaleStatus, User } from "@/types/api"
import { Badge } from "@/components/ui/badge"

const SALE_STATUS_OPTIONS: SaleStatus[] = [
  "EM_ABERTO",
  "PAGO",
  "CANCELADO",
  "ESTORNADO",
]

const INITIAL_SALE: SaleDTO = {
  userId: "",
  eventId: "",
  saleStatus: "EM_ABERTO",
}

function formatDateTime(value?: string) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date)
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saleForm, setSaleForm] = useState<SaleDTO>(INITIAL_SALE)
  const [statusFilter, setStatusFilter] = useState<SaleStatus | "all">("all")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [statusToUpdate, setStatusToUpdate] = useState<SaleStatus>("EM_ABERTO")

  const filteredSales = useMemo(() => {
    if (statusFilter === "all") return sales
    return sales.filter((sale) => sale.saleStatus === statusFilter)
  }, [sales, statusFilter])

  const canSubmit = useMemo(() => {
    return saleForm.userId && saleForm.eventId && saleForm.saleStatus
  }, [saleForm])

  async function loadData() {
    try {
      setIsLoading(true)
      const [salesData, usersData, eventsData] = await Promise.all([
        getSales(),
        getUsers(),
        getEvents(),
      ])
      setSales(salesData)
      setUsers(usersData)
      setEvents(eventsData)
    } catch (error) {
      toast.error("Não foi possível carregar os dados de vendas.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleCreateSale(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    setIsSaving(true)
    try {
      await createSale(saleForm)
      toast.success("Venda cadastrada com sucesso.")
      setSaleForm(INITIAL_SALE)
      await loadData()
    } catch (error) {
      toast.error("Não foi possível cadastrar a venda.")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleUpdateStatus() {
    if (!selectedSale) return
    if (!selectedSale.event?.id) {
      toast.error("Evento não encontrado para esta venda.")
      return
    }

    try {
      setIsSaving(true)
      const payload: SaleDTO = {
        userId: selectedSale.userId,
        eventId: selectedSale.event.id,
        saleStatus: statusToUpdate,
      }
      await updateSaleStatus(selectedSale.id, payload)
      toast.success("Status atualizado com sucesso.")
      setSelectedSale(null)
      await loadData()
    } catch (error) {
      toast.error("Não foi possível atualizar o status.")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteSale(id: string) {
    try {
      await deleteSale(id)
      toast.success("Venda deletada com sucesso.")
      await loadData()
    } catch (error) {
      toast.error("Não foi possível deletar a venda.")
      console.error(error)
    }
  }

  const userById = useMemo(() => {
    return users.reduce<Record<string, User>>((acc, user) => {
      acc[user.id] = user
      return acc
    }, {})
  }, [users])

  return (
    <div className="flex flex-col gap-8">
      <Card>
      <CardHeader className="border-b mb-5">
          <CardTitle className="text-base flex items-center gap-2">
            <CircleDollarSign className="size-4 text-muted-foreground" />
            Cadastro de Vendas
            </CardTitle>
          <CardDescription>
            Inclua uma venda para um usuário e evento específicos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={handleCreateSale}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Usuário</label>
              <Select
                value={saleForm.userId}
                onValueChange={(value) =>
                  setSaleForm((prev) => ({ ...prev, userId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o usuário" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Evento</label>
              <Select
                value={saleForm.eventId}
                onValueChange={(value) =>
                  setSaleForm((prev) => ({ ...prev, eventId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o evento" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={saleForm.saleStatus}
                onValueChange={(value) =>
                  setSaleForm((prev) => ({
                    ...prev,
                    saleStatus: value as SaleStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {SALE_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" disabled={!canSubmit || isSaving}>
                {isSaving ? "Salvando..." : "Registrar venda"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendas</CardTitle>
          <CardDescription>
            {isLoading
              ? "Carregando vendas..."
              : `${filteredSales.length} venda(s) exibida(s).`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Filtrar por status</label>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as SaleStatus | "all")
                }
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {SALE_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data da venda</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => {
                const user = userById[sale.userId]
                return (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">
                      {sale.event?.description ?? sale.event?.id ?? "—"}
                    </TableCell>
                    <TableCell>
                      {user ? `${user.name} (${user.email})` : sale.userId}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{sale.saleStatus.replace("_", " ")}</Badge></TableCell>
                    <TableCell>{formatDateTime(sale.saleDate)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSale(sale)
                          setStatusToUpdate(sale.saleStatus)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleDeleteSale(sale.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" color="red"/>
                      </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {!isLoading && filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhuma venda encontrada para o filtro atual.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedSale)} onOpenChange={() => setSelectedSale(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar status da venda</DialogTitle>
            <DialogDescription>
              Atualize o status da venda selecionada.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Novo status</label>
            <Select
              value={statusToUpdate}
              onValueChange={(value) => setStatusToUpdate(value as SaleStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {SALE_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSale(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isSaving}>
              {isSaving ? "Atualizando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
