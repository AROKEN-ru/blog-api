import { AppError } from "@/common/errors";
import type Elysia from "elysia";

export const errorHandler = (app: Elysia) =>
	app.onError(({ error, set, code }) => {
		if (error instanceof AppError) {
			set.status = error.statusCode;
			return { error: error.message };
		}

		if (code === "NOT_FOUND") {
			return { error: "Not found" };
		}

		set.status = 500;
		return { error: "Internal server error" };
	});
