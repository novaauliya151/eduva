-- CreateTable
CREATE TABLE "site_settings" (
    "id" UUID NOT NULL,
    "theme_name" TEXT NOT NULL DEFAULT 'ocean_royale',
    "primary_color" TEXT NOT NULL DEFAULT '#03045E',
    "secondary_color" TEXT NOT NULL DEFAULT '#023EBA',
    "accent_color" TEXT NOT NULL DEFAULT '#FBB02D',
    "background_color" TEXT NOT NULL DEFAULT '#CAF0F8',
    "text_color" TEXT NOT NULL DEFAULT '#03071E',
    "updated_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
