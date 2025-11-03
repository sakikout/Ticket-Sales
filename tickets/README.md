# Ticket Sales: API do Microsserviço de Vendas (Sales)

Este documento descreve os endpoints JSON disponíveis no microsserviço de vendas, que roda na porta `4000`.

**URL Base:** `http://localhost:4000`

---

## Eventos (`/events`)

Entidade principal para gerenciar os eventos disponíveis para venda.

### 1. Criar Evento

* **Método:** `POST`
* **Endpoint:** `/events`
* **Body (JSON):**
  ```json
  {
    "description": "Show da Banda X",
    "type": "SHOW",
    "date": "2026-12-25T20:00:00",
    "startSales": "2026-11-01T09:00:00",
    "endSales": "2026-12-24T23:59:59",
    "price": 150.75
  }
  ```
* **Resposta (Sucesso):** `201 CREATED` com o objeto do evento criado (incluindo `id`, `createdAt`, `updatedAt`).

### 2. Listar todos os Eventos

* **Método:** `GET`
* **Endpoint:** `/events`
* **Resposta (Sucesso):** `200 OK` com um array de objetos de evento.

### 3. Buscar Evento por ID

* **Método:** `GET`
* **Endpoint:** `/events/{id}`
* **Exemplo:** `/events/a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890`
* **Resposta (Sucesso):** `200 OK` com o objeto do evento.
* **Resposta (Erro):** `404 NOT FOUND` se o ID não existir.

### 4. Atualizar Evento

* **Método:** `PUT`
* **Endpoint:** `/events/{id}`
* **Body (JSON):** (Mesmo formato da criação)
  ```json
  {
    "description": "Show da Banda X (Sessão Extra)",
    "type": "SHOW",
    "date": "2026-12-26T20:00:00",
    "startSales": "2026-11-01T09:00:00",
    "endSales": "2026-12-25T23:59:59",
    "price": 160.00
  }
  ```
* **Resposta (Sucesso):** `200 OK` com o objeto do evento atualizado.
* **Resposta (Erro):** `404 NOT FOUND` se o ID não existir.

### 5. Deletar Evento

* **Método:** `DELETE`
* **Endpoint:** `/events/{id}`
* **Resposta (Sucesso):** `204 NO CONTENT`.
* **Resposta (Erro):** `404 NOT FOUND` se o ID não existir.

---

## Vendas (`/sales`)

Entidade que registra a venda de um ingresso de um evento para um usuário.

### 1. Criar Venda (Comprar Ingresso)

* **Método:** `POST`
* **Endpoint:** `/sales`
* **Body (JSON):**
  ```json
  {
    "userId": "uuid-do-usuario-do-outro-microservico",
    "eventId": "uuid-do-evento-existente",
    "saleStatus": "EM_ABERTO"
  }
  ```
* **Resposta (Sucesso):** `201 CREATED` com o objeto da venda criada (incluindo `id`, `saleDate`, `createdAt`, `updatedAt`).
* **Resposta (Erro):** `404 NOT FOUND` se o `eventId` não existir.

### 2. Listar todas as Vendas

* **Método:** `GET`
* **Endpoint:** `/sales`
* **Resposta (Sucesso):** `200 OK` com um array de objetos de venda.

### 3. Buscar Venda por ID

* **Método:** `GET`
* **Endpoint:** `/sales/{id}`
* **Resposta (Sucesso):** `200 OK` com o objeto da venda.
* **Resposta (Erro):** `404 NOT FOUND` se o ID não existir.

### 4. Listar Vendas por Usuário

* **Método:** `GET`
* **Endpoint:** `/sales/user/{userId}`
* **Exemplo:** `/sales/user/uuid-do-usuario-123`
* **Resposta (Sucesso):** `200 OK` com um array de vendas daquele usuário.

### 5. Atualizar Venda

* **Método:** `PUT`
* **Endpoint:** `/sales/{id}`
* **Body (JSON):** (Mesmo formato da criação)
  ```json
  {
    "userId": "uuid-do-usuario-do-outro-microservico",
    "eventId": "uuid-do-evento-existente",
    "saleStatus": "PAGO"
  }
  ```
* **Resposta (Sucesso):** `200 OK` com o objeto da venda atualizado.
* **Resposta (Erro):** `404 NOT FOUND` se o ID não existir.

### 6. Deletar Venda

* **Método:** `DELETE`
* **Endpoint:** `/sales/{id}`
* **Resposta (Sucesso):** `204 NO CONTENT`.
* **Resposta (Erro):** `404 NOT FOUND` se o ID não existir.
