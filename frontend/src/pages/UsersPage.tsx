import { type FormEvent, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Pencil, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { createUser, deleteUser, getUsers, updateUser } from "@/services/users"
import type { EnumUserType, User, UserDTO } from "@/types/api"
import { Input } from "@/components/ui/input"

const USER_TYPE_OPTIONS: EnumUserType[] = [
  "CUSTOMER",
  "ENTERPRISE",
  "ADMIN",
]

const INITIAL_USER: UserDTO = {
  name: "",
  email: "",
  password: "",
  city: "",
  type: "CUSTOMER",
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userForm, setUserForm] = useState<UserDTO>(INITIAL_USER)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [typeFilter, setTypeFilter] = useState<EnumUserType | "all">("all")

  const canSubmit = useMemo(() => {
    return (
      userForm.name.trim().length > 0 &&
      userForm.email.trim().length > 0 &&
      userForm.password.trim().length > 0 &&
      userForm.city.trim().length > 0 &&
      userForm.type !== undefined
    )
  }, [userForm])

  const filteredUsers = useMemo(() => {
    if (typeFilter === "all") return users
    return users.filter((user) => user.type === typeFilter)
  }, [users, typeFilter])

  async function loadData() {
    try {
      setIsLoading(true)
      const usersData = await getUsers()
      setUsers(usersData)
    } catch (error) {
      toast.error("Não foi possível carregar os dados de usuários.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    setIsSaving(true)
    try {
      await createUser(userForm)
    } catch (error) {
      toast.error("Não foi possível cadastrar o usuário.")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteUser(id: string) {
    try {
      await deleteUser(id)
      toast.success("Usuário deletado com sucesso.")
      await loadData()
    } catch (error) {
      toast.error("Não foi possível deletar o usuário.")
      console.error(error)
    }
    }

  async function handleUpdateUser() {
    if (!selectedUser) return
    try {
      await updateUser(selectedUser.id, userForm)
      toast.success("Usuário atualizado com sucesso.")
      setSelectedUser(null)
      await loadData()
    } catch (error) {
      toast.error("Não foi possível atualizar o usuário.")
      console.error(error)
    }
  }

  
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader className="border-b mb-5">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
          Cadastro de Usuários
          </CardTitle>
          <CardDescription>
            Inclua um usuário para o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={handleCreateUser}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Nome</label>
              <Input
                placeholder="Nome do usuário"
                value={userForm.name}
                onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                placeholder="Email do usuário"
                value={userForm.email}
                onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Senha</label>
              <Input
                placeholder="Senha do usuário"
                value={userForm.password}
                onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Cidade</label>
              <Input
                placeholder="Cidade do usuário"
                value={userForm.city}
                onChange={(e) => setUserForm((prev) => ({ ...prev, city: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={userForm.type}
                onValueChange={(value) => setUserForm((prev) => ({ ...prev, type: value as EnumUserType }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {USER_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" disabled={!canSubmit || isSaving}>
                {isSaving ? "Salvando..." : "Registrar usuário"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            {isLoading
              ? "Carregando usuários..."
              : `${filteredUsers.length} usuário(s) exibido(s).`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Filtrar por tipo</label>
              <Select
                value={userForm.type}
                onValueChange={(value) =>
                    setTypeFilter(value as EnumUserType | "all")
                }
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {USER_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell>
                      {user.email}
                    </TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.type?.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setUserForm((prev) => ({ ...prev, type: user.type as EnumUserType }))
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleDeleteUser(user.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" color="red"/>
                      </Button>
                    </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {!isLoading && filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedUser)} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar usuário</DialogTitle>
            <DialogDescription>
              Atualize o usuário selecionado.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Nome</label>
            <Input
                placeholder="Nome do usuário"            
                value={userForm.name}
                onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
                required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              placeholder="Email do usuário"
              value={userForm.email}
              onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Cidade</label>
            <Input
              placeholder="Cidade do usuário"
              value={userForm.city}
              onChange={(e) => setUserForm((prev) => ({ ...prev, city: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select
              value={userForm.type}
              onValueChange={(value) => setUserForm((prev) => ({ ...prev, type: value as EnumUserType }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setSelectedUser(null)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleUpdateUser} disabled={isSaving}>
              {isSaving ? "Atualizando..." : "Atualizar usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
