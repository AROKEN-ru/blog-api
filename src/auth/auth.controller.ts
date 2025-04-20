import Elysia from "elysia";

import { createUser, loginUser } from "@/users/users.schema";
import { loginUseCase } from "./application/login.usecase";
import { registerUseCase } from "./application/register.usecase";
import { COOKIE_OPTIONS, accessJwtSetup, refreshJwtSetup } from "./jwtSetup";

export const authController = new Elysia({
	prefix: "/auth",
	detail: { tags: ["Auth"] },
})
	.use(accessJwtSetup)
	.use(refreshJwtSetup)
	.post(
		"/register",
		async ({ body, accessJwt, refreshJwt, set, cookie }) => {
			const user = await registerUseCase(body);
			const accessToken = await accessJwt.sign({
				id: user.id,
				username: user.username,
			});
			const refreshToken = await refreshJwt.sign({
				id: user.id,
				username: user.username,
			});

			cookie.access_token.set({
				value: accessToken,
				...COOKIE_OPTIONS.access,
			});
			cookie.refresh_token.set({
				value: refreshToken,
				...COOKIE_OPTIONS.refresh,
			});

			set.status = 201;
			return {
				message: "User created successfully",
				user: {
					id: user.id,
					username: user.username,
				},
			};
		},
		{
			body: createUser,
		},
	)
	.post(
		"/login",
		async ({ body, accessJwt, refreshJwt, cookie }) => {
			const user = await loginUseCase(body);
			const accessToken = await accessJwt.sign({
				id: user.id,
				username: user.username,
			});
			const refreshToken = await refreshJwt.sign({
				id: user.id,
				username: user.username,
			});

			cookie.access_token.set({
				value: accessToken,
				...COOKIE_OPTIONS.access,
			});
			cookie.refresh_token.set({
				value: refreshToken,
				...COOKIE_OPTIONS.refresh,
			});

			return {
				message: "Logged in successfully",
				user: {
					id: user.id,
					username: user.username,
				},
			};
		},
		{
			body: loginUser,
		},
	)
	.post("/logout", ({ cookie }) => {
		cookie.access_token.remove();
		cookie.refresh_token.remove();
		return {
			message: "Logged out successfully",
		};
	});
