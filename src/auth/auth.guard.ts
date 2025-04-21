import type Elysia from "elysia";

import { AppError } from "@/common/errors";
import { COOKIE_OPTIONS, accessJwtSetup, refreshJwtSetup } from "./jwtSetup";

export const authGuard = (app: Elysia) =>
	app
		.use(accessJwtSetup)
		.use(refreshJwtSetup)
		.derive(async ({ cookie, accessJwt, refreshJwt }) => {
			const accessToken = cookie.access_token?.value;
			const refreshToken = cookie.refresh_token?.value;

			if (accessToken) {
				const accessPayload = await accessJwt.verify(accessToken);
				if (accessPayload)
					return {
						user: {
							id: accessPayload.id,
							username: accessPayload.username,
						},
					};
			}

			if (refreshToken) {
				const refreshPayload = await refreshJwt.verify(refreshToken);
				if (refreshPayload) {
					const newAccessToken = await accessJwt.sign({
						id: refreshPayload.id,
						username: refreshPayload.username,
					});
					const newRefreshToken = await refreshJwt.sign({
						id: refreshPayload.id,
						username: refreshPayload.username,
					});

					cookie.access_token.set({
						value: newAccessToken,
						...COOKIE_OPTIONS.access,
					});
					cookie.refresh_token.set({
						value: newRefreshToken,
						...COOKIE_OPTIONS.refresh,
					});

					return {
						user: {
							id: refreshPayload.id,
							username: refreshPayload.username,
						},
					};
				}
			}

			throw new AppError("Unauthorized", 401);
		});
