
# 🗂️ Organize API

Bem-vindo ao projeto `organize-api-startup` — uma API simples e leve para gerenciar tarefas e usuários, pensada para aprendizado e prototipagem.

## 🛠️ Tecnologias utilizadas
- 🟢 Node.js + Express
- 📘 TypeScript
- 🗄️ Prisma ORM
- 🐳 Docker & Docker Compose
- ☁️ AWS S3 (Supabase) — armazenamento de arquivos
- 🔐 JWT — autenticação baseada em token
- ✅ Zod — validação de entradas

## 📖 Sumário
- [Instalação](#-instalação)
- [Comandos essenciais](#-comandos-essenciais)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Endpoints disponíveis](#-endpoints-disponíveis)
- [Equipe & contato](#-equipe--contato)

## 🚀 Instalação

Siga os passos abaixo para rodar a API localmente.

1️⃣ Clone o repositório e entre na pasta:
```bash
git clone <seu-repositorio> organize-api-startup
cd organize-api-startup
```

2️⃣ Instale as dependências:
```bash
npm install
```

3️⃣ Copie o arquivo de exemplo de variáveis de ambiente e ajuste:
```bash
cp .env.example .env
# edite .env com seus valores (DATABASE_URL, JWT_SECRET, AWS_*)
```

4️⃣ Gere o Prisma Client:
```bash
npx prisma generate
```

5️⃣ Sincronize o schema com o banco (desenvolvimento rápido):
```bash
npx prisma db push
```

6️⃣ Inicie em modo desenvolvimento (hot-reload):
```bash
npm run dev
```

Abra: http://localhost:3000/api/

### 🐳 Rodando com Docker

1. Configure `.env` como no passo 3.
2. Suba os serviços:
```bash
docker compose up -d
```

A API ficará disponível em `http://localhost:3000/api/`. Se o `docker-compose` contém serviço do Prisma Studio, acesse-o em `http://localhost:5555`.

## 📌 Comandos essenciais

- 🚀 Desenvolvimento: `npm run dev` (tsx/ts-node/tsx-watch conforme script)
- 🔧 Build: `npm run build`
- ▶️ Produção: `npm start`
- 🧱 Gerar Prisma Client: `npx prisma generate` ou `npm run prisma:generate`
- 📊 Prisma Studio: `npx prisma studio`
- 🔁 Sincronizar schema (dev): `npx prisma db push`
- 🗂 Criar migração: `npx prisma migrate dev --name nome_da_migracao`
- 🐳 Docker: `docker compose up -d` / `docker compose down`

## 📂 Estrutura do projeto

```
organize-api-startup/
├── prisma/                    # schema.prisma e migrations
├── src/                       # código fonte (controllers, routes, services...)
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── repository/
│   ├── resources/
│   ├── routes/
│   ├── schemas/
│   └── services/
├── docker-compose.yaml
├── Dockerfile
├── package.json
└── README.md
```

> Observação: o projeto já inclui rotas organizadas em `src/routes` (autenticadas e não-autenticadas). Importe a collection Postman `organize.postman_collection.json` se quiser testar rapidamente.

## 🔑 Variáveis de ambiente

Exemplo das variáveis necessárias — crie `.env` com essas chaves:

```env
# Servidor
PORT=3000
NODE_ENV=development
CORS_ORIGIN="*"

# Cache / logs
TTL_CACHE=300
LOG_LEVEL=debug

# Autenticação
JWT_SECRET="sua_chave_secreta_aqui"

# Banco de dados (ex: SQLite para dev, Postgres em produção)
DATABASE_URL="file:./dev.db"

# AWS / Supabase (Storage)
AWS_DEFAULT_REGION="sa-east-1"
AWS_USE_PATH_STYLE_ENDPOINT=true
AWS_ACCESS_KEY_ID="sua_access_key"
AWS_SECRET_ACCESS_KEY="sua_secret_key"
AWS_ENDPOINT="sua_url_do_supabase"
AWS_URL="sua_url_base"
AWS_BUCKET="seu_bucket"
```

Adapte conforme o `prisma/schema.prisma` para usar Postgres, MySQL ou SQLite.

## 📡 Endpoints disponíveis

Base: `/api/`

### 🔐 Autenticação
- `POST /api/auth/register` — Registrar novo usuário
- `POST /api/auth/login` — Autenticar (retorna JWT)
- `GET /api/auth/me` — Dados do usuário autenticado
- `PUT /api/auth/update-profile` — Atualizar perfil do usuário

### 🗂️ Tarefas
- `GET /api/tasks` — Listar tarefas (pode haver variações entre rotas autenticadas e não autenticadas)
- `POST /api/tasks` — Criar tarefa
- `PUT /api/tasks/:id` — Atualizar tarefa
- `DELETE /api/tasks/:id` — Deletar tarefa

> Dica: importe `organize.postman_collection.json` (se presente) para testes rápidos.

## � Equipe de desenvolvimento

Projeto base — ajuste os créditos conforme sua equipe.

- Pedro Henrique Martins Borges — pedro.henrique.martins404@gmail.com - [@piedro404](https://github.com/piedro404)
- Matheus Augusto - augustomatheus233@gmail.com - [@Matheuz233](https://github.com/Matheuz233) 

## 📞 Contato

Qualquer dúvida ou sugestão, me chame: pedro.henrique.martins404@gmail.com

---

✨ README atualizado com o estilo iconográfico (emojis) — igual ao projeto que você gostou.

Próximos opcionais que posso fazer para melhorar ainda mais:
- ✨ Sincronizar a seção de Endpoints com os caminhos exatos em `src/routes` (posso varrer e atualizar automaticamente);
- 🧾 Gerar um `.env.example` completo e com comentários;
- 📬 Adicionar exemplos `curl` e um pequeno guia de autenticação com token.

Diga qual desses extras prefere que eu faça agora.

