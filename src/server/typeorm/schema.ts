/* eslint-disable @typescript-eslint/indent */
/* eslint-disable new-cap */
import {
	Column,
	DataSource,
	Entity,
	PrimaryColumn,
} from "typeorm";

@Entity("users")
export class User {
	@PrimaryColumn({ name: "id" })
	id: string;

	@Column({ name: "email" })
	email: string;

	@Column({ name: "first_name" })
	firstName: string;

	@Column({ name: "last_name" })
	lastName: string;

	@Column({ name: "is_deleted" })
	isDeleted: boolean;

	@Column({ name: "password" })
	password: string;

	@Column({ name: "salt" })
	salt: string;
}

export const init = async (config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const PostgresDataSource = new DataSource({
		host: config.host,
		port: config.port,
		username: config.user,
		password: config.password,
		database: config.database,
		type: "postgres",
		synchronize: false,
		entities: [User],
	});

	await PostgresDataSource.initialize();

	return { PostgresDataSource };
};
