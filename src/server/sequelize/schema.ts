import { DataTypes, Sequelize } from "sequelize";

export const init = (config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const sequelize = new Sequelize(config.database, config.user, config.password, {
		host: config.host,
		port: config.port,
		dialect: "postgres",
		logging: false,
	});

	const User = sequelize.define("users", {
		id: { type: DataTypes.UUIDV4, primaryKey: true },
		email: { type: DataTypes.STRING },
		first_name: { type: DataTypes.STRING },
		last_name: { type: DataTypes.STRING },
		is_deleted: { type: DataTypes.BOOLEAN },
		password: { type: DataTypes.STRING },
		salt: { type: DataTypes.STRING },
	});

	return { User, sequelize };
};
