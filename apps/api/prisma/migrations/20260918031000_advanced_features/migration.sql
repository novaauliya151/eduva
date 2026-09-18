ALTER TABLE "live_sessions"
ADD COLUMN "reminder_day_sent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "reminder_start_sent" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "transactions"
ADD COLUMN "proof_url" TEXT,
ADD COLUMN "receipt_number" TEXT,
ADD COLUMN "rejection_note" TEXT,
ADD COLUMN "reviewed_by" UUID,
ADD COLUMN "reviewed_at" TIMESTAMP(3);

CREATE UNIQUE INDEX "transactions_receipt_number_key" ON "transactions"("receipt_number");
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "audit_logs" (
  "id" UUID NOT NULL,
  "actor_id" UUID,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
