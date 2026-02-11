import { type FormEvent, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createEvent, deleteEvent, getEvents } from "@/services/events"
import type { Event, EventDTO, EventType } from "@/types/api"
import { Calendar, Trash2 } from "lucide-react"

const EVENT_TYPES: EventType[] = [
  "PALESTRA",
  "MESA_REDONDA",
  "SHOW",
  "TEATRO",
  "CURSO",
  "FEIRA",
  "FESTIVAL",
  "OUTRO",
]

const INITIAL_FORM: EventDTO = {
  description: "",
  type: "PALESTRA",
  date: "",
  startSales: "",
  endSales: "",
  price: 0,
}

function toLocalDateTime(value: string) {
  if (!value) return value
  return value.length === 16 ? `${value}:00` : value
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<EventDTO>(INITIAL_FORM)

  const canSubmit = useMemo(() => {
    return (
      formData.description.trim().length > 0 &&
      formData.date &&
      formData.startSales &&
      formData.endSales &&
      formData.price > 0
    )
  }, [formData])

  async function loadEvents() {
    try {
      setIsLoading(true)
      const data = await getEvents()
      setEvents(data)
    } catch (error) {
      toast.error("Não foi possível carregar os eventos.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    setIsSaving(true)
    try {
      const payload: EventDTO = {
        ...formData,
        date: toLocalDateTime(formData.date),
        startSales: toLocalDateTime(formData.startSales),
        endSales: toLocalDateTime(formData.endSales),
      }
      await createEvent(payload)
      toast.success("Evento cadastrado com sucesso.")
      setFormData(INITIAL_FORM)
      await loadEvents()
    } catch (error) {
      toast.error("Não foi possível cadastrar o evento.")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }


  async function handleDeleteEvent(id: string) {
    try {
      await deleteEvent(id)
      toast.success("Evento deletado com sucesso.")
      await loadEvents()
    } catch (error) {
      toast.error("Não foi possível deletar o evento.")
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader className="border-b mb-5">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
          Cadastro de Eventos
          </CardTitle>
          <CardDescription>
            Registre novos eventos e defina período de vendas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Descrição</label>
              <Input
                value={formData.description}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Nome do evento"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: value as EventType,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Data do evento</label>
              <Input
                type="datetime-local"
                value={formData.date}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, date: event.target.value }))
                }
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Início das vendas</label>
              <Input
                type="datetime-local"
                value={formData.startSales}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    startSales: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Fim das vendas</label>
              <Input
                type="datetime-local"
                value={formData.endSales}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    endSales: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Preço</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: Number(event.target.value),
                  }))
                }
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={!canSubmit || isSaving}>
                {isSaving ? "Salvando..." : "Cadastrar evento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eventos cadastrados</CardTitle>
          <CardDescription>
            {isLoading
              ? "Carregando eventos..."
              : `${events.length} evento(s) encontrado(s).`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Vendas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    {event.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.type.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(event.date)}</TableCell>
                  <TableCell>{formatCurrency(event.price)}</TableCell>
                  <TableCell>
                    {formatDateTime(event.startSales)} →{" "}
                    {formatDateTime(event.endSales)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="w-4 h-4" color="red"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum evento cadastrado ainda.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
