import { PG } from "@js-ak/db-manager";

await PG.MigrationSystem.CreateEmptySQL.create();

process.exit(0);
