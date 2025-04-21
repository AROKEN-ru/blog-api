import Elysia from "elysia";

import { authGuard } from "@/auth/auth.guard";

export const usersController = new Elysia({
	prefix: "/users",
	detail: { tags: ["Users"] },
})
	.use(authGuard)
	.get(
		"/me",
		({ user }) => {
			return {
				message: "User found",
				user: {
					id: user.id,
					username: user.username,
				},
			};
		},
		{
			detail: {
				description: "Get the current user",
			},
		},
	);
