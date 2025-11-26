-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shareCode" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "ownershipPct" DECIMAL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aircraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tailNumber" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "manufacturer" TEXT,
    "year" INTEGER,
    "status" TEXT DEFAULT 'AVAILABLE',
    "totalHours" DECIMAL DEFAULT 0,
    "nextMaintenance" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizationId" TEXT,
    CONSTRAINT "Aircraft_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Aircraft" ("createdAt", "id", "manufacturer", "model", "nextMaintenance", "status", "tailNumber", "totalHours", "updatedAt", "year") SELECT "createdAt", "id", "manufacturer", "model", "nextMaintenance", "status", "tailNumber", "totalHours", "updatedAt", "year" FROM "Aircraft";
DROP TABLE "Aircraft";
ALTER TABLE "new_Aircraft" RENAME TO "Aircraft";
CREATE UNIQUE INDEX "Aircraft_tailNumber_organizationId_key" ON "Aircraft"("tailNumber", "organizationId");
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "purpose" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "googleEventId" TEXT,
    "calendarSynced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizationId" TEXT,
    "aircraftId" TEXT NOT NULL,
    "reservedById" TEXT NOT NULL,
    "pilotId" TEXT,
    CONSTRAINT "Booking_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_reservedById_fkey" FOREIGN KEY ("reservedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("aircraftId", "calendarSynced", "createdAt", "endDate", "googleEventId", "id", "notes", "pilotId", "purpose", "reservedById", "startDate", "status", "title", "updatedAt") SELECT "aircraftId", "calendarSynced", "createdAt", "endDate", "googleEventId", "id", "notes", "pilotId", "purpose", "reservedById", "startDate", "status", "title", "updatedAt" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expenseDate" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizationId" TEXT,
    "paidById" TEXT,
    "flightId" TEXT,
    CONSTRAINT "Expense_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Expense_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("amount", "category", "createdAt", "expenseDate", "flightId", "id", "notes", "paidById", "updatedAt") SELECT "amount", "category", "createdAt", "expenseDate", "flightId", "id", "notes", "paidById", "updatedAt" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
CREATE TABLE "new_Flight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flightDate" DATETIME NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "distanceNm" DECIMAL,
    "fuelStart" DECIMAL,
    "fuelEnd" DECIMAL,
    "durationHours" DECIMAL,
    "baseAbsorption" TEXT,
    "baseFixedAbsorption" TEXT,
    "baseTax" DECIMAL,
    "travelExpenses" DECIMAL DEFAULT 0,
    "maintenanceExpenses" DECIMAL DEFAULT 0,
    "totalCost" DECIMAL DEFAULT 0,
    "notes" TEXT,
    "attachment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizationId" TEXT,
    "pilotId" TEXT,
    "payerId" TEXT,
    "aircraftId" TEXT,
    "usedById" TEXT,
    CONSTRAINT "Flight_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Flight_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flight_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flight_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flight_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Flight" ("aircraftId", "attachment", "baseAbsorption", "baseFixedAbsorption", "baseTax", "createdAt", "destination", "distanceNm", "durationHours", "flightDate", "fuelEnd", "fuelStart", "id", "maintenanceExpenses", "notes", "origin", "payerId", "pilotId", "totalCost", "travelExpenses", "updatedAt", "usedById") SELECT "aircraftId", "attachment", "baseAbsorption", "baseFixedAbsorption", "baseTax", "createdAt", "destination", "distanceNm", "durationHours", "flightDate", "fuelEnd", "fuelStart", "id", "maintenanceExpenses", "notes", "origin", "payerId", "pilotId", "totalCost", "travelExpenses", "updatedAt", "usedById" FROM "Flight";
DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_shareCode_key" ON "Organization"("shareCode");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_userId_organizationId_key" ON "OrganizationMember"("userId", "organizationId");
