ALTER TABLE "media" ADD COLUMN "data" "bytea" NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_filename_unique" UNIQUE("filename");