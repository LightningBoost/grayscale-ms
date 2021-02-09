-- CreateTable
CREATE TABLE "Purchases" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(65,30) NOT NULL,

    PRIMARY KEY ("id")
);
