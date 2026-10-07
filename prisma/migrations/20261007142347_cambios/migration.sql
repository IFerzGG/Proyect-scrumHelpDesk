-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_agente_id_fkey";

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "agente_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_agente_id_fkey" FOREIGN KEY ("agente_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
