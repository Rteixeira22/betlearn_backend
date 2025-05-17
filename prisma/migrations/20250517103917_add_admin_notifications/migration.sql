-- CreateTable
CREATE TABLE "AdminNotification" (
    "id_notification" SERIAL NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "message" VARCHAR(1000) NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'error',
    "source" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AdminNotification_pkey" PRIMARY KEY ("id_notification")
);
