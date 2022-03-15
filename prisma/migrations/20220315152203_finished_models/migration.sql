/*
  Warnings:

  - Added the required column `completedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPositive` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverOrSender` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amountUsed" REAL NOT NULL,
    "dateCreated" DATETIME NOT NULL,
    "currency" TEXT NOT NULL,
    "receiverOrSender" TEXT NOT NULL,
    "completedAt" TEXT NOT NULL,
    "isPositive" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amountUsed", "dateCreated", "id", "userId") SELECT "amountUsed", "dateCreated", "id", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
