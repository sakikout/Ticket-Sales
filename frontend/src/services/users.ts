import api from "@/services/api"
import type { User } from "@/types/api"

export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users")
  return response.data
}
