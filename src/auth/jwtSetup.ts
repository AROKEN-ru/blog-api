import jwt from "@elysiajs/jwt";
import type { CookieOptions } from "elysia";

import { config } from "@/config";

export const accessJwtSetup = jwt({
	name: "accessJwt",
	secret: config.JWT_ACCESS_SECRET,
	exp: "15m",
});

export const refreshJwtSetup = jwt({
	name: "refreshJwt",
	secret: config.JWT_REFRESH_SECRET,
	exp: "7d",
});

export const COOKIE_OPTIONS = {
	access: {
		httpOnly: true,
		sameSite: "strict",
		path: "/",
		maxAge: 60 * 15, // 15 minutes
	},
	refresh: {
		httpOnly: true,
		sameSite: "strict",
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 7 days
	},
} as {
	access: CookieOptions;
	refresh: CookieOptions;
};
