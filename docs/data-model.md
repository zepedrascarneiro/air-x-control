# Modelagem de Dados (Prisma)

Resumo dos modelos definidos em `prisma/schema.prisma`.

## User

- id (cuid)
- name (string)
- email (string, único)
- hashedPassword (string)
- role (string; padrão: VIEWER)
- status (string; padrão: ACTIVE)
- phone (string?)
- createdAt / updatedAt
- Relações: flightsAsPilot, flightsAsPayer, expenses, sessions

## Session

- id (cuid)
- token (string, único; hash do token real)
- userId (fk User)
- ip (string?)
- userAgent (string?)
- expiresAt (Date)
- createdAt / updatedAt

## Aircraft

- id (cuid)
- tailNumber (string, único)
- model (string)
- manufacturer (string?)
- year (int?)
- status (string?; padrão: AVAILABLE)
- totalHours (Decimal?, padrão 0)
- nextMaintenance (DateTime?)
- createdAt / updatedAt
- Relações: flights

## Flight

- id (cuid)
- flightDate (DateTime)
- origin / destination (string)
- planSequence / legSequence (int?)
- categoryCode (int?)
- distanceNm, hobbsStart, hobbsEnd, durationHours (Decimal?)
- baseAbsorption, baseFixedAbsorption, baseTax, baseFixedTax (Decimal?)
- travelExpenses, maintenanceExpenses, totalCost (Decimal?)
- notes (string?)
- pilotId, payerId, aircraftId
- createdAt / updatedAt
- Relações: pilot(User), payer(User), aircraft(Aircraft), expenses(Expense[])

## Expense

- id (cuid)
- expenseDate (DateTime)
- category (string)
- amount (Decimal)
- notes (string?)
- paidById, flightId
- createdAt / updatedAt
- Relações: paidBy(User), flight(Flight)

## DemoRequest

- id (cuid)
- name, email
- phone?, company?, preferredDate?, message?
- status (string; padrão: PENDING)
- createdAt / updatedAt

Observação: campos Decimal são manipulados pelo Prisma Client conforme configuração do adapter JS (geralmente `Prisma.Decimal`).
