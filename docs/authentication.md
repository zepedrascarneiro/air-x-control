# Autenticação

Fluxo de autenticação baseado em sessões persistidas no banco + cookie HttpOnly.

## Conceitos

- Cookie: `airx_session` (HttpOnly, SameSite=Lax, Secure em produção)
- Tabela: `Session` (token hash SHA-256, `expiresAt`, `userAgent`, `ip`)
- Duração padrão: 7 dias
- Modelos envolvidos: `User`, `Session`

## Endpoints

- `POST /api/auth/register`
  - Body: `{ name, email, password, confirmPassword, phone?, role? }`
  - 201: `{ user }` (sem `hashedPassword`) + cookie de sessão
  - 409: e-mail já cadastrado
  - 422: validação inválida (Zod)

- `POST /api/auth/login`
  - Body: `{ email, password }`
  - 200: `{ user }` + cookie de sessão
  - 401: credenciais inválidas
  - 403: conta inativa
  - 422: validação inválida

- `POST /api/auth/logout`
  - 200: `{ success: true }` e cookie limpo

## Helpers (`src/lib/auth.ts`)

- `hashPassword(password)` / `verifyPassword(password, hashed)` — usa `bcryptjs`
- `createSession(userId, metadata)` — cria registro e retorna `{ token, session }`
- `attachSessionCookie(response, token)` — injeta cookie no `NextResponse`
- `getCurrentSession()` / `getCurrentUser()` — consulta sessão por cookie
- `requireCurrentUser()` — redireciona para `/login` quando não autenticado

## Proteção de rotas

- Dashboard (`/dashboard`) usa `requireCurrentUser()` para exigir login.
- Navbar/landing exibem ações condicionadas ao estado de sessão.

## Erros e mensagens

- `P2002` (Prisma Unique) mapeado para 409 em registro
- Zod (`422`) usado para mensagens de formulário claras

## Futuro

- Refresh/rotating tokens
- Expiração sliding (atualizamos `expiresAt` com uso)
- RBAC granular por `role` (ADMIN/CONTROLLER/VIEWER)
