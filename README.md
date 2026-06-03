# AV2 — Arrecifes Tecnologia

Projeto full stack de solicitação de serviços de TI, migrado da versão AV1 para React, backend REST, Prisma ORM e PostgreSQL.

## Stack

- Frontend: React + Vite.
- Backend: Express + TypeScript.
- ORM: Prisma.
- Banco: PostgreSQL.
- Docker: `postgres`, `backend` e `frontend`.

## Checklist AV2

| Requisito | Status |
| --- | --- |
| Implementar o projeto da AV1 em React | OK — telas migradas para componentes React em `frontend/src/pages` |
| Manter estilo e layout da AV1 | OK — identidade visual, cards, tabelas, formulários e navegação preservados |
| Usar um componente React por página | OK — `HomePage`, `LoginPage`, `RegisterPage`, `ChangePasswordPage`, `ServiceRequestsPage`, `ServiceCreatePage` |
| Usar componentes menores quando útil | OK — `Layout` e `PasswordHint` |
| Usar Hooks para controle de estado | OK — `useState`, `useEffect`, `useMemo`, `useRef` e `useNavigate` |
| Não usar DOM JS para controlar páginas | OK — sem `querySelector`, `createElement`, `innerHTML` ou manipulação DOM nos componentes |
| Tabela de cliente no banco | OK — model `Client` |
| Tabela de serviço de TI no banco | OK — model `Service` |
| Tabela de solicitação de serviço de TI no banco | OK — model `ServiceRequest` com FK para `Client` e `Service` |
| Backend com autenticação por login e senha | OK — `POST /api/auth/login` |
| Backend com troca de senha usando login, senha atual e nova senha | OK — `POST /api/auth/change-password` |
| Backend com cadastro de cliente | OK — `POST /api/auth/register` |
| Backend verifica login duplicado no cadastro | OK — retorna erro quando e-mail já existe |
| Backend com cadastro de serviços de TI | OK — `POST /api/services` |
| Serviço de TI com chave primária inteira autoincremento | OK — `Service.id` com `autoincrement()` |
| Backend com consulta de serviços de TI | OK — `GET /api/services` |
| Backend com consulta de solicitações por usuário | OK — `GET /api/requests?login=email` |
| Backend com atualização da lista de solicitações do usuário | OK — `PUT /api/requests` apaga e reinsere a lista recebida |
| Página de login chama endpoint de autenticação | OK |
| Página de troca de senha chama endpoint de troca de senha | OK |
| Página de cadastro chama endpoint de cadastro de cliente | OK |
| Página de carrinho carrega serviços pela API | OK |
| Página de carrinho carrega solicitações do usuário pela API | OK |
| Página de carrinho possui botão para atualizar solicitações | OK — botão `Atualizar solicitações` |
| Nova página para cadastro de serviço de TI | OK — rota `/servicos/novo` |
| Validações obrigatórias na página de cadastro de serviço | OK — nome, preço e prazo |
| Dados persistidos em banco, não em armazenamento temporário | OK — clientes, serviços e solicitações ficam no PostgreSQL |
| Docker com banco, backend e frontend | OK — `docker-compose.yml` |
| Backend organizado em camadas | OK — `routes`, `controllers`, `middlewares`, `lib` |

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/health` | Health check da API |
| `POST` | `/api/auth/login` | Autenticação |
| `POST` | `/api/auth/change-password` | Troca de senha |
| `POST` | `/api/auth/register` | Cadastro de cliente |
| `GET` | `/api/auth/me` | Dados do cliente autenticado |
| `GET` | `/api/services` | Consulta serviços de TI |
| `POST` | `/api/services` | Cadastro serviço de TI |
| `GET` | `/api/requests?login=email@exemplo.com` | Consulta solicitações do usuário |
| `PUT` | `/api/requests` | Atualiza lista de solicitações do usuário |

## Rodando com Docker

Com o Docker Desktop aberto:

```bash
docker compose up --build
```

Serviços:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001/api
- PostgreSQL: localhost:5432

Para recriar o banco limpo com o seed inicial:

```bash
docker compose down -v
docker compose up --build
```

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

## Validação

Comandos usados para checar o projeto:

```bash
npm run build -w frontend
npm run build -w backend
DATABASE_URL='postgresql://postgres:postgres@localhost:5432/it_services?schema=public' npx prisma validate --schema backend/prisma/schema.prisma
docker compose ps
curl http://localhost:3001/api/health
curl http://localhost:3001/api/services
```

## Observações

- A sessão do frontend guarda apenas o JWT e dados públicos do cliente no navegador.
- `Login` e `Cadastro` ficam ocultos na navbar quando o usuário está logado.
- O seed inicial cadastra serviços de TI e ajusta a sequência autoincremento para permitir novos cadastros.
- Os arquivos PDF de especificação não fazem mais parte do repositório.
