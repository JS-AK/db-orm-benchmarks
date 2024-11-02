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
		id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: () => crypto.randomUUID() },

		id_user_role: { type: DataTypes.UUIDV4 },

		email: { type: DataTypes.STRING },
		first_name: { type: DataTypes.STRING },
		last_name: { type: DataTypes.STRING },
		password: { type: DataTypes.STRING },
		salt: { type: DataTypes.STRING },

		deleted_at: { type: DataTypes.DATE },
		is_deleted: { type: DataTypes.BOOLEAN },

		created_at: { type: DataTypes.DATE },
		updated_at: { type: DataTypes.DATE },
	}, { timestamps: false });

	const UserRole = sequelize.define("user_roles", {
		id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: () => crypto.randomUUID() },

		title: { type: DataTypes.STRING },

		created_at: { type: DataTypes.DATE },
		updated_at: { type: DataTypes.DATE },
	}, { timestamps: false });

	return { User, UserRole, sequelize };
};
