/*
  Warnings:

  - You are about to drop the column `amountUsed` on the `Transaction` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL DEFAULT 0,
    "dateCreated" DATETIME NOT NULL,
    "currency" TEXT NOT NULL,
    "receiverOrSender" TEXT NOT NULL,
    "completedAt" TEXT NOT NULL,
    "isPositive" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("completedAt", "currency", "dateCreated", "id", "isPositive", "receiverOrSender", "userId") SELECT "completedAt", "currency", "dateCreated", "id", "isPositive", "receiverOrSender", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
