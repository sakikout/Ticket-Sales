# 🏷️ Frontend Ticket-Sales

Essa aplicação apresenta a visualização Web das funcionalidades da API criada na Tarefa Prática 1 em Spring Boot. Nessa aplicação, temos o painel administrativo do sistema (rota `/admin`), além de uma página para usuários que são clientes. Ademais, utilizamos o Gateway em Spring Boot para criar a comunicação com o serviço de backend.

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-%23000000?style=for-the-badge&logo=shadcnui&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

## ⚙️Inicialização

Para inicializar somente o frontend, estando no diretório `frontend`, basta rodar `npm install` para instalar as dependências, e `npm run dev`. Como o funcionamento depende do backend, é imprescindível que ele também esteja rodando, o que pode ser feito utilizando o Docker.

Para buildar a imagem, vá para a pasta `/docker` no terminal e rode `docker compose -f docker-compose-dev.yml up --build`. Certifique-se que a api e o frontend estejam rodando corretamente.

## 📎Funcionalidades

### 1. Página de Eventos (/admin/events)

Na página de eventos, é possível visualizar eventos existentes no banco de dados, além de cadastrar um novo evento e deletar eventos já existentes.

### 2. Página de Vendas (/admin/sales)

Ná página de vendas, é possível visualizar vendas existentes no banco de dados, além de cadastrar uma nova venda, editar o status de uma venda e deletar vendas já existentes.

### 3. Página de Usuários (/admin/users)

Ná página de usuários, é possivel visualizar todos os usuários existentes, além de cadastrar um novo usuário e editar ou deletar usuários já existentes.

### 4. Página de Eventos (/events)

Na página de eventos fora do painel administrativo, o usuário pode visualizar eventos existentes e comprar ingressos para eles.

### 5. Página de Perfil (/profile)

Na página de perfil, o usuário pode ver informações do seu perfil, além de compras que ele realizou. Ele pode estornar uma compra, ou pagar uma compra com status em aberto.
