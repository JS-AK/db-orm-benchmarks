import { getConfig } from "../server/config/index.js";

import { start as selectFromDbStart } from "./select-from-db.js";

const { data: config, message } = getConfig();

if (!config) {
	process.stderr.write(`${message}\n`);
	process.exit(1);
} else {
	await selectFromDbStart(config);
}
