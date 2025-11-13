# Páginas e UX

Visão geral das páginas, componentes e proteção de rotas.

## Páginas (App Router)

- `/` — Landing com CTA, links para Dashboard, Login, Registro.
  - Comportamento: se logado, mostra saudação, link "Meu painel" e botão "Sair".
- `/dashboard` — Painel Operacional (protegido), carrega dados via `getDashboardData()`.
  - Proteção: `requireCurrentUser()` redireciona para `/login` se não autenticado.
  - Mostra botão `LogoutButton`.
- `/login` — Formulário de acesso (`LoginForm`).
  - Se já logado, redireciona para `/dashboard`.
- `/register` — Formulário de cadastro (`RegisterForm`).
  - Se já logado, redireciona para `/dashboard`.
- `/demo` — Formulário de pedido de demonstração.
- `/pricing` — Página de planos.

## Componentes

- `DemoForm` — formulário de demonstração (Zod + React Hook Form + toast de feedback)
- `LoginForm` — formulário de login (toasts de sucesso/erro + foco automático)
- `RegisterForm` — formulário de cadastro (toasts de sucesso/erro + reset após sucesso)
- `EditorPanel` — central do Administrador/Comandante com cadastro de aeronaves, gerenciamento de voos/despesas, filtros persistentes na URL (debounce de 200ms) e toasts de feedback
- `useDebouncedCallback` — hook utilitário em `@/lib/hooks` para reutilizar debounce em formulários e buscas
- `LogoutButton` — botão cliente para encerrar sessão
- `ToastProvider` + `useToast` — contexto cliente para toasts reutilizáveis (feedback imediato na central do Administrador/Comandante)

## Estilo e Layout

- `src/app/globals.css` + Tailwind para estilos globais
- Layout raiz (`src/app/layout.tsx`) injeta fonte, cores, e container base

## Navegação Condicional

- Header ajusta as ações com base no estado da sessão (links de login/registro x sair/meu painel)

## Próximos passos

- Expandir o uso de toasts para demais formulários críticos (registro, login, solicitações)
- Página de perfil (`/account`) para troca de senha e dados pessoais
