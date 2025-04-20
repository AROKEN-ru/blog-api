import { config } from "@/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const sqlite = createClient({
	url: config.DATABASE_URL,
});
export const db = drizzle(sqlite, {
	casing: "snake_case",
});
