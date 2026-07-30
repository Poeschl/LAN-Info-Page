CREATE TABLE "player_stats" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	"mac_address1" varchar(64) NOT NULL,
	"mac_address2" varchar(64),
	"hostname" varchar(255),
	"ipv4_address" varchar(64),
	"board_manufacturer" varchar(255),
	"baseboard" varchar(255),
	"system_product_name" varchar(255),
	"bios_release" varchar(255),
	"cpu" varchar(255),
	"gpu" varchar(255),
	"windows_edition" varchar(255),
	"player_name" varchar(255),
	"current_game" varchar(255),
	"last_seen_at" timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "player_stats_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "player_stats_mac_address1_key" UNIQUE ("mac_address1")
);
