/*
  Warnings:

  - You are about to drop the column `ceado` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "ceado",
ADD COLUMN     "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
