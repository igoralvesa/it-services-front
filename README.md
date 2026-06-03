# AV2 — Arrecifes Tecnologia

Projeto migrado da versão AV1 em HTML/CSS/JS puro para uma aplicação full stack com:

- Frontend em React + Vite.
- Backend REST em Express.
- Prisma ORM.
- PostgreSQL.
- Docker Compose com banco, backend e frontend.

## Estrutura

```text
frontend/   Aplicação React
backend/    API Express, Prisma, migrations e seed
```

Os PDFs `projeto_av1 (2).pdf` e `projeto_av2.pdf` foram mantidos na raiz como referência dos requisitos.

## Rodando com Docker

Com o Docker Desktop aberto:

```bash
docker compose up --build
```

Serviços:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001/api
- PostgreSQL: localhost:5432

Ao subir o backend, ele executa `prisma migrate deploy` e o seed dos serviços de TI.

## Rodando localmente

Instale as dependências:

```bash
npm install
```

Configure o backend:

```bash
cp backend/.env.example backend/.env
npm run prisma:migrate
npm run prisma:seed
```

Suba a API:

```bash
npm run dev:backend
```

Suba o frontend:

```bash
npm run dev:frontend
```

## Endpoints

- `POST /api/auth/login`
- `POST /api/auth/change-password`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/services`
- `POST /api/services`
- `GET /api/requests?login=email@exemplo.com`
- `PUT /api/requests`

## Observações

- A sessão do frontend guarda apenas o JWT e os dados públicos do cliente no navegador.
- Clientes, serviços e solicitações são persistidos no PostgreSQL.
- A página de troca de senha usa login, senha atual e nova senha, conforme a AV2.
- A página de solicitações carrega serviços e solicitações pela API e salva a lista completa pelo botão `Atualizar solicitações`.
