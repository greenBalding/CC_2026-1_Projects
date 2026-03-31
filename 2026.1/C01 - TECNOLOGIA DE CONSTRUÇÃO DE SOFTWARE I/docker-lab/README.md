# Docker Lab - Ambiente Full-Stack

Este projeto atende aos requisitos do laboratório com Docker Compose.

## Observação importante

As funcionalidades abaixo foram adicionadas **como extra** para validar e demonstrar o funcionamento completo do backend e da persistência:

- Jogo da velha no frontend
- Ranking de jogadores
- Histórico de partidas
- API no backend (NestJS)
- Persistência no PostgreSQL
- Visualização dos dados no pgAdmin

Esses extras foram usados para testar:

- rotas HTTP (`GET /games`, `POST /games`, `GET /ranking`)
- integração frontend-backend
- gravação e leitura no banco
- persistência dos dados entre reinícios dos containers

## Como executar

Na pasta do projeto:

```bash
docker compose up --build -d
```

## Portas padrão

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Nginx: `http://localhost:8080`
- pgAdmin: `http://localhost:5550`
- PostgreSQL: `localhost:5532`
