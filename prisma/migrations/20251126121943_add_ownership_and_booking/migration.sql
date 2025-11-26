/*
  Warnings:

  - You are about to drop the column `baseFixedTax` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `categoryCode` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `legSequence` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `planSequence` on the `Flight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "ownershipPct" DECIMAL DEFAULT 0;

-- CreateTable
CREATE TABLE "Booking" (
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
    "aircraftId" TEXT NOT NULL,
    "reservedById" TEXT NOT NULL,
    "pilotId" TEXT,
    CONSTRAINT "Booking_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_reservedById_fkey" FOREIGN KEY ("reservedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CalendarIntegration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL DEFAULT 'google',
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "calendarId" TEXT,
    "syncEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CalendarIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "pilotId" TEXT,
    "payerId" TEXT,
    "aircraftId" TEXT,
    "usedById" TEXT,
    CONSTRAINT "Flight_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flight_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flight_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flight_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Flight" ("aircraftId", "baseAbsorption", "baseFixedAbsorption", "baseTax", "createdAt", "destination", "distanceNm", "durationHours", "flightDate", "fuelEnd", "fuelStart", "id", "maintenanceExpenses", "notes", "origin", "payerId", "pilotId", "totalCost", "travelExpenses", "updatedAt") SELECT "aircraftId", "baseAbsorption", "baseFixedAbsorption", "baseTax", "createdAt", "destination", "distanceNm", "durationHours", "flightDate", "fuelEnd", "fuelStart", "id", "maintenanceExpenses", "notes", "origin", "payerId", "pilotId", "totalCost", "travelExpenses", "updatedAt" FROM "Flight";
DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CalendarIntegration_userId_key" ON "CalendarIntegration"("userId");
