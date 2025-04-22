import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@tqman/nice-logger";
import Elysia from "elysia";

import { authController } from "@/auth/auth.controller";
import { errorHandler } from "@/plugins/error-handler";
import { usersController } from "@/users/users.controller";
import { postsController } from "./posts/posts.controller";

export const app = new Elysia()
	.use(
		cors({
			credentials: true,
		}),
	)
	.use(logger())
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
	.use(errorHandler)
	.group("/api", (app) =>
		app.use(authController).use(usersController).use(postsController),
	);
