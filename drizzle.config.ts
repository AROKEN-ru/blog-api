import { defineConfig } from "drizzle-kit";
import env from "env-var";

const DATABASE_URL = env.get("DATABASE_URL").required().asString();

export default defineConfig({
	schema: "./src/**/*.schema.ts",
	out: "./migrations",
	dialect: "sqlite",
	casing: "snake_case",
	dbCredentials: {
		url: DATABASE_URL,
	},
})
