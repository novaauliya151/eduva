ALTER TABLE "users" ADD COLUMN "email_verified_at" TIMESTAMP(3);

CREATE TABLE "refresh_tokens" (
 "id" UUID NOT NULL,
 "user_id" UUID NOT NULL,
 "token_hash" TEXT NOT NULL,
 "expires_at" TIMESTAMP(3) NOT NULL,
 "revoked_at" TIMESTAMP(3),
 "replaced_by_id" UUID,
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "email_verification_tokens" (
 "id" UUID NOT NULL,
 "user_id" UUID NOT NULL,
 "token_hash" TEXT NOT NULL,
 "expires_at" TIMESTAMP(3) NOT NULL,
 "used_at" TIMESTAMP(3),
 "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "email_verification_tokens_token_hash_key" ON "email_verification_tokens"("token_hash");
CREATE INDEX "email_verification_tokens_user_id_idx" ON "email_verification_tokens"("user_id");
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
