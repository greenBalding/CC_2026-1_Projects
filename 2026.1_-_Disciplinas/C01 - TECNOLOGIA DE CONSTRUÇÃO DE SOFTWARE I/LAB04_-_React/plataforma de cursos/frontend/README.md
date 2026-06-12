# LearnGPT — Plataforma de Cursos

Plataforma de cursos online desenvolvida como projeto da atividade prática da disciplina **LAB04 - React** da disciplina de **Tecnologia de Construção de Software I** (2026.1).

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Bundler** | Vite 8 |
| **Estilização** | Bootstrap 5 + React Bootstrap |
| **Roteamento** | React Router DOM 7 |
| **Backend (mock)** | JSON Server |

## Estrutura do Projeto

```
plataforma de cursos/
├── backend/                    # Mock da API
│   └── db.json                 # Banco de dados (JSON Server)
│
└── frontend/                   # Aplicação React
    └── src/
        ├── components/         # Componentes reutilizáveis
        │   ├── layout/         # Estrutura da página (sidebar, navbar)
        │   └── ui/             # Componentes visuais (ícones, modal)
        ├── context/            # Context API (estado global)
        ├── hooks/              # Custom hooks
        ├── models/             # Interfaces/Types do domínio
        ├── pages/              # Páginas da aplicação
        │   ├── admin/          # Painel administrativo
        │   ├── auth/           # Login e Registro
        │   ├── checkout/       # Planos e pagamento
        │   ├── cursos/         # Catálogo, detalhes e player
        │   ├── dashboard/      # Página inicial
        │   ├── explore/        # Explorar cursos
        │   ├── profile/        # Perfil do usuário
        │   └── trilhas/        # Trilhas de aprendizado
        ├── services/           # Comunicação com a API
        └── utils/              # Constantes e utilitários
```

## Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- npm

### Instalação

```bash
cd frontend
npm install
```

### Execução

Abra **dois terminais**:

**Terminal 1 — Backend (API mock):**
```bash
cd frontend
npm run server
```
> Roda em http://localhost:3001

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
> Roda em http://localhost:5173

## Perfis de Usuário

| Perfil | Acesso |
|--------|--------|
| **Aluno** | Dashboard, cursos, trilhas, perfil |
| **Instrutor** | Tudo do aluno + painel admin |
| **Administrador** | Acesso completo (CRUD de todas as entidades) |

### Usuários de Teste

| Nome | Email | Senha | Perfil |
|------|-------|-------|--------|
| Aluno Teste 1 | alunoteste1@dbjson.com | 123456 | Aluno |
| Admin | admin@dbjson.com | 123456 | Administrador |
| Gemini 3.5 Flash | google@google.com | 123456 | Instrutor |
| Opus 3.6 (Thinking) | opus@anthropic.com | 123456 | Instrutor |

## Funcionalidades

- Autenticação (login/registro)
- Dashboard com progresso dos cursos
- Catálogo de cursos com filtros por categoria e nível
- Player de aulas com tracking de progresso
- Trilhas de aprendizado
- Sistema de avaliações
- Certificados de conclusão
- Planos e assinaturas (checkout)
- Perfil do usuário
- Painel administrativo (CRUD completo)

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite) |
| `npm run server` | Inicia o JSON Server (API mock) |
| `npm run build` | Gera build de produção |
| `npm run lint` | Executa o ESLint |
| `npm run preview` | Preview do build de produção |
