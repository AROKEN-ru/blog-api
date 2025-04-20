import env from "env-var";

export const config = {
	PORT: env.get("PORT").default(3000).asPortNumber(),
	DATABASE_URL: env.get("DATABASE_URL").required().asString(),
	JWT_ACCESS_SECRET: env.get("JWT_ACCESS_SECRET").required().asString(),
	JWT_REFRESH_SECRET: env.get("JWT_REFRESH_SECRET").required().asString(),
};
