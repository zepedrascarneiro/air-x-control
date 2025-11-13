/*
  Warnings:

  - You are about to drop the column `hobbsEnd` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `hobbsStart` on the `Flight` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flightDate" DATETIME NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "planSequence" INTEGER,
    "legSequence" INTEGER,
    "categoryCode" INTEGER,
    "distanceNm" DECIMAL,
    "fuelStart" DECIMAL,
    "fuelEnd" DECIMAL,
    "durationHours" DECIMAL,
    "baseAbsorption" DECIMAL DEFAULT 0,
    "baseFixedAbsorption" DECIMAL DEFAULT 0,
    "baseTax" DECIMAL DEFAULT 0,
    "baseFixedTax" DECIMAL DEFAULT 0,
    "travelExpenses" DECIMAL DEFAULT 0,
    "maintenanceExpenses" DECIMAL DEFAULT 0,
    "totalCost" DECIMAL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "pilotId" TEXT,
    "payerId" TEXT,
    "aircraftId" TEXT,
    CONSTRAINT "Flight_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flight_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Flight_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Flight" ("aircraftId", "baseAbsorption", "baseFixedAbsorption", "baseFixedTax", "baseTax", "categoryCode", "createdAt", "destination", "distanceNm", "durationHours", "flightDate", "id", "legSequence", "maintenanceExpenses", "notes", "origin", "payerId", "pilotId", "planSequence", "totalCost", "travelExpenses", "updatedAt") SELECT "aircraftId", "baseAbsorption", "baseFixedAbsorption", "baseFixedTax", "baseTax", "categoryCode", "createdAt", "destination", "distanceNm", "durationHours", "flightDate", "id", "legSequence", "maintenanceExpenses", "notes", "origin", "payerId", "pilotId", "planSequence", "totalCost", "travelExpenses", "updatedAt" FROM "Flight";
DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
