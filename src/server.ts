import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { authController } from "@/auth/auth.controller";
import { errorHandler } from "@/plugins/error-handler";
import { usersController } from "@/users/users.controller";

export const app = new Elysia()
	.use(errorHandler)
	.use(
		swagger({
			path: "/api/docs",
			documentation: {
				info: {
					title: "Blog API",
					description: "Aroken.ru",
					version: "1.0.0",
				},
			},
		}),
	)
	.group("/api", (app) => app.use(authController).use(usersController));
