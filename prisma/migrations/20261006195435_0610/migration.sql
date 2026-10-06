/*
  Warnings:

  - Added the required column `comentario` to the `comentarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `notificaciones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comentarios" ADD COLUMN     "comentario" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notificaciones" ADD COLUMN     "usuario_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
