import { MikroORM, type PostgreSqlDriver } from "@mikro-orm/postgresql"; // or any other driver package

export const init = async (config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const orm = await MikroORM.init<PostgreSqlDriver>({
		entities: ["./build/server/mikro-orm/entities"],
		entitiesTs: ["./src/server/mikro-orm/entities"],
		host: config.host,
		port: config.port,
		user: config.user,
		password: config.password,
		dbName: config.database,
		type: "postgresql",
	});

	return { orm };
};
