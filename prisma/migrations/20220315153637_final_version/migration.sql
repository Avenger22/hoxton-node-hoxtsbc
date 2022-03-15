/*
  Warnings:

  - You are about to drop the column `amount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT 'Jurgen',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "amountInAccount" REAL NOT NULL DEFAULT 10.00
);
INSERT INTO "new_User" ("email", "firstName", "id", "lastName", "password") SELECT "email", "firstName", "id", "lastName", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_fullName_key" ON "User"("fullName");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
