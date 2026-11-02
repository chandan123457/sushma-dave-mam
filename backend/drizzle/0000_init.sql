CREATE TYPE "public"."publication_type" AS ENUM('journal', 'book', 'chapter', 'conference', 'patent', 'other');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(120) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "awards" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"issuer" varchar(200),
	"year" varchar(20),
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collaborators" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"affiliation" text,
	"url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"url" text NOT NULL,
	"mime" varchar(120) NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(255),
	"body" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"date" date NOT NULL,
	"link" text,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" varchar(160) NOT NULL,
	"honorific" varchar(20) DEFAULT 'Dr.' NOT NULL,
	"designation" varchar(160) NOT NULL,
	"department" varchar(200) NOT NULL,
	"institution" varchar(200) NOT NULL,
	"location" varchar(160) NOT NULL,
	"tagline" text NOT NULL,
	"short_bio" text NOT NULL,
	"bio" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"alt_email" varchar(255),
	"phone" varchar(40),
	"photo_url" text,
	"cv_url" text,
	"scholar_url" text,
	"institution_url" text,
	"interests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"education" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"courses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"stats" jsonb NOT NULL,
	"citations_by_year" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"funder" varchar(200),
	"amount" varchar(60),
	"role" varchar(80),
	"status" varchar(40) DEFAULT 'ongoing' NOT NULL,
	"period" varchar(60),
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publications" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(220) NOT NULL,
	"title" text NOT NULL,
	"authors" text NOT NULL,
	"venue" text DEFAULT '' NOT NULL,
	"publisher" varchar(255),
	"volume" varchar(40),
	"issue" varchar(40),
	"pages" varchar(40),
	"year" integer,
	"published_on" varchar(40),
	"type" "publication_type" DEFAULT 'journal' NOT NULL,
	"abstract" text,
	"doi" varchar(255),
	"url" text,
	"pdf_url" text,
	"cover_url" text,
	"citations" integer DEFAULT 0 NOT NULL,
	"scholar_id" varchar(80),
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "publications_slug_unique" UNIQUE("slug"),
	CONSTRAINT "publications_scholar_id_unique" UNIQUE("scholar_id")
);
--> statement-breakpoint
CREATE TABLE "research_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"summary" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "publications_year_idx" ON "publications" USING btree ("year");--> statement-breakpoint
CREATE INDEX "publications_type_idx" ON "publications" USING btree ("type");