-- CreateEnum
CREATE TYPE "task_status" AS ENUM ('BACKLOG', 'ANDAMENTO', 'VALIDACAO', 'CONCLUIDA');

-- CreateEnum
CREATE TYPE "type_transaction" AS ENUM ('DEPOSIT', 'EXPENSE');

-- CreateEnum
CREATE TYPE "category_transaction" AS ENUM ('NONSENSE', 'ESSENTIAL', 'NECESSARY', 'MONTHLY_BILL');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "task_status" NOT NULL DEFAULT 'BACKLOG',
ALTER COLUMN "concluido" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name_bill" TEXT NOT NULL,
    "type_transaction" "type_transaction" NOT NULL DEFAULT 'DEPOSIT',
    "category" "category_transaction" NOT NULL DEFAULT 'NONSENSE',
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "proof_url" TEXT,
    "location" TEXT,
    "date" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_id_key" ON "Transactions"("id");

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
