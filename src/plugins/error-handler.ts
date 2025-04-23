import type Elysia from "elysia";

import { AppError } from "@/common/errors";

export const errorHandler = (app: Elysia) =>
	app.error({ AppError }).onError(({ error, set, code }) => {
		switch (code) {
			case "AppError":
				set.status = error.statusCode;
				return { error: error.message };
			case "VALIDATION":
				return {
					error: "Validation error",
					details: error.all
						.filter((e) => e.summary !== undefined)
						.map((e) => ({
							path: e.path ?? "unknown",
							message: e.message,
							schema: e.schema,
						})),
				};
			case "NOT_FOUND":
				return { error: "Not found" };
			case "PARSE":
				return { error: "Parse error" };
			case "INVALID_COOKIE_SIGNATURE":
				return { error: "Invalid cookie signature" };
			case "INTERNAL_SERVER_ERROR":
			case "UNKNOWN":
				return { error: "Internal server error" };
			default:
				return { error: "Unhandled error" };
		}
	});
