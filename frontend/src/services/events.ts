import api from "@/services/api"
import type { Event, EventDTO } from "@/types/api"

export async function getEvents(): Promise<Event[]> {
  const response = await api.get<Event[]>("/events")
  return response.data
}

export async function createEvent(payload: EventDTO): Promise<Event> {
  const response = await api.post<Event>("/events", payload)
  return response.data
}
