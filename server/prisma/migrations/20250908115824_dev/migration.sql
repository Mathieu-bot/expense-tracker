-- CreateEnum
CREATE TYPE "public"."ExpenseType" AS ENUM ('ONE_TIME', 'RECURRING');

-- CreateTable
CREATE TABLE "public"."user" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50),
    "email" VARCHAR(255) NOT NULL,
    "hashed_password" VARCHAR(255) NOT NULL,
    "firstname" VARCHAR(100),
    "lastname" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."expense_category" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(50) NOT NULL,
    "icon_url" VARCHAR(500),
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expense_category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "public"."expense" (
    "expense_id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR(2000),
    "type" "public"."ExpenseType" NOT NULL DEFAULT 'ONE_TIME',
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expense_date" TIMESTAMP(3),
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "last_processed" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("expense_id")
);

-- CreateTable
CREATE TABLE "public"."income" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" VARCHAR(100),
    "description" VARCHAR(2000),
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."receipt" (
    "receipt_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "expense_id" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "mime_type" VARCHAR(50) NOT NULL,
    "size" INTEGER NOT NULL,
    "bytes" BYTEA NOT NULL,
    "sha256" TEXT NOT NULL,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipt_pkey" PRIMARY KEY ("receipt_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "receipt_expense_id_key" ON "public"."receipt"("expense_id");

-- CreateIndex
CREATE UNIQUE INDEX "receipt_sha256_key" ON "public"."receipt"("sha256");

-- CreateIndex
CREATE INDEX "receipt_user_id_idx" ON "public"."receipt"("user_id");

-- CreateIndex
CREATE INDEX "receipt_mime_type_idx" ON "public"."receipt"("mime_type");

-- AddForeignKey
ALTER TABLE "public"."expense_category" ADD CONSTRAINT "expense_category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expense" ADD CONSTRAINT "expense_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expense" ADD CONSTRAINT "expense_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."expense_category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."income" ADD CONSTRAINT "income_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."receipt" ADD CONSTRAINT "receipt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."receipt" ADD CONSTRAINT "receipt_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "public"."expense"("expense_id") ON DELETE CASCADE ON UPDATE CASCADE;
