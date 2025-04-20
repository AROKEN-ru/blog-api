import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
	type CreateUserDTO,
	type GetUserDTO,
	usersTable,
} from "./users.schema";

export class UsersRepository {
	static async createUser(userToCreate: CreateUserDTO) {
		const [user] = await db.insert(usersTable).values(userToCreate).returning();
		return user;
	}

	static async findUserByUsername(
		username: string,
	): Promise<GetUserDTO | undefined> {
		const [user] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.username, username));
		return user;
	}
}
