-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('COMPUTER', 'MONITOR', 'HEADSET', 'KEYBOARD', 'MOUSE', 'BLM', 'ICCID', 'OTHERS');

-- CreateEnum
CREATE TYPE "LoanRecordType" AS ENUM ('CHECK_IN', 'CHECK_OUT');

-- CreateEnum
CREATE TYPE "CallLogType" AS ENUM ('TECHNICAL_ISSUE', 'CITRIX_ISSUE', 'PROCEDURE_QUESTION', 'OTHERS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cooperators" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "departure_date" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cooperators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipments" (
    "id" TEXT NOT NULL,
    "cooperatorId" TEXT,
    "serial_number" TEXT NOT NULL,
    "type" "EquipmentType" NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "broken_at" TIMESTAMP(3),
    "broken_reason" TEXT,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_records" (
    "id" TEXT NOT NULL,
    "cooperator_id" TEXT NOT NULL,
    "made_by" TEXT NOT NULL,
    "type" "LoanRecordType" NOT NULL,
    "ocurred_at" TIMESTAMP(3),

    CONSTRAINT "loan_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_logs" (
    "id" TEXT NOT NULL,
    "cooperator_id" TEXT NOT NULL,
    "made_by" TEXT NOT NULL,
    "type" "CallLogType" NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "call_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cooperator_id" TEXT,
    "loan_record_id" TEXT,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LoanRecordEquipment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LoanRecordEquipment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_employee_id_key" ON "users"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "cooperators_user_name_key" ON "cooperators"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "cooperators_employee_id_key" ON "cooperators"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "cooperators_nif_key" ON "cooperators"("nif");

-- CreateIndex
CREATE UNIQUE INDEX "cooperators_email_key" ON "cooperators"("email");

-- CreateIndex
CREATE UNIQUE INDEX "equipments_serial_number_key" ON "equipments"("serial_number");

-- CreateIndex
CREATE INDEX "_LoanRecordEquipment_B_index" ON "_LoanRecordEquipment"("B");

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_cooperatorId_fkey" FOREIGN KEY ("cooperatorId") REFERENCES "cooperators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_records" ADD CONSTRAINT "loan_records_cooperator_id_fkey" FOREIGN KEY ("cooperator_id") REFERENCES "cooperators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_records" ADD CONSTRAINT "loan_records_made_by_fkey" FOREIGN KEY ("made_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_cooperator_id_fkey" FOREIGN KEY ("cooperator_id") REFERENCES "cooperators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_made_by_fkey" FOREIGN KEY ("made_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_cooperator_id_fkey" FOREIGN KEY ("cooperator_id") REFERENCES "cooperators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_loan_record_id_fkey" FOREIGN KEY ("loan_record_id") REFERENCES "loan_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LoanRecordEquipment" ADD CONSTRAINT "_LoanRecordEquipment_A_fkey" FOREIGN KEY ("A") REFERENCES "equipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LoanRecordEquipment" ADD CONSTRAINT "_LoanRecordEquipment_B_fkey" FOREIGN KEY ("B") REFERENCES "loan_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
