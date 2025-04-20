import { authGuard } from "@/auth/auth.guard";
import Elysia from "elysia";

export const usersController = new Elysia({
	prefix: "/users",
	detail: { tags: ["Users"] },
})
	.use(authGuard)
	.get("/me", ({ user }) => {
		return user;
	});
