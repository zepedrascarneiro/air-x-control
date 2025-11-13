# API

Contratos de endpoints disponíveis no App Router (rotas em `src/app/api`).

## Convenções

- Respostas em JSON
- Erros: `{ message: string }` + status apropriado
- Validação: Zod em todos os POSTs

## Auth

- POST `/api/auth/register` — cria usuário e inicia sessão
- POST `/api/auth/login` — autentica e inicia sessão
- POST `/api/auth/logout` — encerra sessão atual

Veja `docs/authentication.md` para detalhes de payload e cookies.

## Demo Requests

- GET `/api/demo` — lista pedidos de demonstração (mais recentes primeiro)
- POST `/api/demo` — cria pedido de demonstração
  - Body: `{ name, email, phone?, company?, preferredDate?, message? }`

## Flights

- GET `/api/flights` — lista voos com relações (pilot/payer/aircraft/expenses)
- POST `/api/flights` — cria voo
  - Body (parcial):

    ```json
    {
      "flightDate": "2025-11-10T10:00:00.000Z",
      "origin": "SBSP",
      "destination": "SBRJ",
      "pilotId": "...",
      "aircraftId": "...",
      "fuelStart": 123.4,
      "fuelEnd": 124.8,
      "durationHours": 1.4,
      "totalCost": 3500
    }
    ```

## Códigos de status

- 200/201: sucesso
- 400: erro de negócio/entrada
- 401/403: auth/permite
- 409: conflito (duplicidade)
- 422: validação (Zod)
- 500: erro inesperado
